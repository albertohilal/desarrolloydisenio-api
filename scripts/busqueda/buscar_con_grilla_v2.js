require('dotenv').config();
const axios = require('axios');
const pool = require('../../db');

// Configuración
const RADIO_CELDA = 750; // Radio en metros para cada celda
const MAX_PAGINAS = 3;
const DELAY_ENTRE_REQUESTS = 300;
const DELAY_ENTRE_PAGINAS = 2000;

/**
 * Obtener celdas SELECCIONADAS para un rubro específico
 */
async function obtenerCeldasSeleccionadas(grillaNombre, rubroId) {
  const [rows] = await pool.query(`
    SELECT 
      g.id, 
      g.codigo, 
      g.lat_centro as latitud, 
      g.lng_centro as longitud, 
      g.grilla_nombre,
      gr.estado
    FROM ll_grilla g
    INNER JOIN ll_grilla_rubros gr ON g.id = gr.grilla_id
    WHERE g.grilla_nombre = ? 
      AND gr.rubro_id = ?
      AND gr.estado = 'seleccionado'
    ORDER BY g.codigo
  `, [grillaNombre, rubroId]);
  
  console.log(`📍 Celdas seleccionadas para rubro ${rubroId}: ${rows.length}`);
  return rows;
}

/**
 * Verificar si una celda ya fue buscada
 */
async function fueYaBuscada(grillaId, keyword) {
  const [rows] = await pool.query(`
    SELECT 1 
    FROM ll_busquedas_realizadas 
    WHERE grilla_id = ? AND keyword = ?
  `, [grillaId, keyword]);
  return rows.length > 0;
}

/**
 * Registrar búsqueda realizada
 */
async function registrarBusqueda(grillaId, keyword, resultados) {
  await pool.query(`
    INSERT INTO ll_busquedas_realizadas (grilla_id, keyword, created_at)
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      created_at = NOW()
  `, [grillaId, keyword]);
}

/**
 * Obtener detalles de un lugar
 */
async function obtenerDetalles(placeId) {
  try {
    const fields = [
      "place_id", "name", "formatted_address", "vicinity", 
      "formatted_phone_number", "website", "opening_hours", 
      "geometry", "rating", "user_ratings_total", "price_level",
      "types", "business_status"
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    await new Promise(r => setTimeout(r, 100));
    return response.data.result || {};
  } catch (err) {
    console.error(`      ❌ Error detalles:`, err.message);
    return {};
  }
}

/**
 * Guardar lugar en BD
 */
async function guardarLugar(detalles, rubro_id) {
  try {
    const tipos = detalles.types ? detalles.types.join(',') : null;
    const abierto = detalles.opening_hours?.open_now === true ? 1 : 
                   detalles.opening_hours?.open_now === false ? 0 : null;

    await pool.query(`
      INSERT INTO ll_lugares (
        place_id, nombre, direccion, telefono, sitio_web,
        latitud, longitud, rubro_id, zona_id,
        rating, reviews, tipos, precio, abierto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        direccion = VALUES(direccion),
        telefono = VALUES(telefono),
        sitio_web = VALUES(sitio_web),
        rating = VALUES(rating),
        reviews = VALUES(reviews)
    `, [
      detalles.place_id,
      detalles.name || '',
      detalles.formatted_address || detalles.vicinity || '',
      detalles.formatted_phone_number || null,
      detalles.website || null,
      detalles.geometry?.location?.lat || null,
      detalles.geometry?.location?.lng || null,
      rubro_id,
      detalles.rating || null,
      detalles.user_ratings_total || null,
      tipos,
      detalles.price_level || null,
      abierto
    ]);
    return true;
  } catch (error) {
    console.error(`      ❌ Error guardar:`, error.message);
    return false;
  }
}

/**
 * Buscar en una celda
 */
async function buscarEnCelda(celda, keyword, rubroId) {
  let totalResultados = 0;
  let nextPageToken = null;

  for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${celda.latitud},${celda.longitud}&radius=${RADIO_CELDA}&keyword=${encodeURIComponent(keyword)}&key=${process.env.GOOGLE_API_KEY}`;
      
      if (nextPageToken) {
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${process.env.GOOGLE_API_KEY}`;
        await new Promise(r => setTimeout(r, DELAY_ENTRE_PAGINAS));
      }

      const response = await axios.get(url);
      const results = response.data.results || [];
      
      console.log(`      📄 Página ${pagina}: ${results.length} resultados`);

      for (const place of results) {
        const detalles = await obtenerDetalles(place.place_id);
        const guardado = await guardarLugar(detalles, rubroId);
        if (guardado) totalResultados++;
        await new Promise(r => setTimeout(r, DELAY_ENTRE_REQUESTS));
      }

      nextPageToken = response.data.next_page_token;
      if (!nextPageToken) break;

    } catch (error) {
      console.error(`      ❌ Error en página ${pagina}:`, error.message);
      break;
    }
  }

  return totalResultados;
}

/**
 * Buscar para un rubro específico
 */
async function buscarRubro(rubroId, grillaNombre) {
  const [rubros] = await pool.query(`
    SELECT id, nombre, keyword_google 
    FROM ll_rubros 
    WHERE id = ?
  `, [rubroId]);

  if (rubros.length === 0) {
    console.log(`❌ Rubro ${rubroId} no encontrado`);
    return;
  }

  const rubro = rubros[0];
  console.log(`\n🎯 Iniciando búsqueda: ${rubro.nombre || rubro.keyword_google}`);
  console.log(`📍 Keyword: ${rubro.keyword_google}`);
  console.log(`🗺️  Grilla: ${grillaNombre}`);

  const celdas = await obtenerCeldasSeleccionadas(grillaNombre, rubroId);
  
  if (celdas.length === 0) {
    console.log(`⚠️  No hay celdas seleccionadas para este rubro`);
    return;
  }

  let celdasBuscadas = 0;
  let celdasSaltadas = 0;
  let totalLugares = 0;

  for (const celda of celdas) {
    const yaBuscada = await fueYaBuscada(celda.id, rubro.keyword_google);
    
    if (yaBuscada) {
      celdasSaltadas++;
      console.log(`   ⏭️  ${celda.codigo} - Ya buscada`);
      continue;
    }

    console.log(`   🔍 ${celda.codigo} - Buscando...`);
    const lugares = await buscarEnCelda(celda, rubro.keyword_google, rubroId);
    
    await registrarBusqueda(celda.id, rubro.keyword_google, lugares);
    
    celdasBuscadas++;
    totalLugares += lugares;
    console.log(`   ✅ ${celda.codigo} - ${lugares} lugares guardados`);
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   🔍 Celdas buscadas: ${celdasBuscadas}`);
  console.log(`   ⏭️  Celdas saltadas: ${celdasSaltadas}`);
  console.log(`   📍 Total lugares: ${totalLugares}`);
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Uso: node buscar_con_grilla_v2.js <rubro_id> <grilla_nombre>');
    console.log('   Ejemplo: node buscar_con_grilla_v2.js 296 conurbano_sur_v1_extendida');
    process.exit(1);
  }

  const rubroId = parseInt(args[0]);
  const grillaNombre = args[1];

  try {
    await buscarRubro(rubroId, grillaNombre);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

main();
