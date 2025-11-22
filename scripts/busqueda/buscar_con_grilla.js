require('dotenv').config();
const axios = require('axios');
const pool = require('../../db');

// Configuración
const RADIO_CELDA = 750; // Radio en metros para cada celda (750m = 0.75 km)
const MAX_PAGINAS = 3; // Máximo de páginas por búsqueda
const DELAY_ENTRE_REQUESTS = 300; // ms entre requests
const DELAY_ENTRE_PAGINAS = 2000; // ms entre páginas

/**
 * Obtener rubros activos para búsqueda
 */
async function obtenerRubros() {
  const [rows] = await pool.query(`
    SELECT id, nombre, keyword_google 
    FROM ll_rubros 
    WHERE busqueda = 1 
    ORDER BY id
  `);
  return rows;
}

/**
 * Obtener celdas de una grilla específica
 */
async function obtenerCeldas(grillaNombre) {
  const [rows] = await pool.query(`
    SELECT id, codigo, latitud, longitud, grilla_nombre
    FROM ll_grilla 
    WHERE grilla_nombre = ?
    ORDER BY codigo
  `, [grillaNombre]);
  return rows;
}

/**
 * Verificar si una celda ya fue buscada para un keyword específico
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
  try {
    await pool.query(`
      INSERT INTO ll_busquedas_realizadas (grilla_id, keyword, resultados_encontrados, fecha)
      VALUES (?, ?, ?, NOW())
    `, [grillaId, keyword, resultados]);
  } catch (error) {
    console.warn(`   ⚠️ No se pudo registrar búsqueda (tabla ll_busquedas_realizadas puede no existir)`);
  }
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
    return response.data.result || {};
  } catch (err) {
    console.error(`      ❌ Error al obtener detalles de ${placeId}:`, err.message);
    return {};
  }
}

/**
 * Guardar lugar en la base de datos
 */
async function guardarLugar(detalles, rubro_id, celda) {
  try {
    await pool.query(`
      INSERT INTO ll_lugares (
        place_id, nombre, direccion, telefono, sitio_web,
        latitud, longitud, rubro_id, zona_id,
        rating, reviews, tipos, precio, abierto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        direccion = VALUES(direccion),
        telefono = VALUES(telefono),
        sitio_web = VALUES(sitio_web),
        latitud = VALUES(latitud),
        longitud = VALUES(longitud),
        rating = VALUES(rating),
        reviews = VALUES(reviews),
        tipos = VALUES(tipos),
        precio = VALUES(precio),
        abierto = VALUES(abierto)
    `, [
      detalles.place_id || null,
      detalles.name || null,
      detalles.formatted_address || null,
      detalles.formatted_phone_number || null,
      detalles.website || null,
      detalles.geometry?.location?.lat || null,
      detalles.geometry?.location?.lng || null,
      rubro_id,
      null, // zona_id - se puede asignar después según coordenadas
      detalles.rating || null,
      detalles.user_ratings_total || null,
      detalles.types ? detalles.types.join(', ') : null,
      detalles.price_level || null,
      detalles.opening_hours?.open_now ? 1 : 0
    ]);
    
    return true;
  } catch (err) {
    console.error(`      ❌ Error al guardar lugar:`, err.message);
    return false;
  }
}

/**
 * Buscar lugares en una celda específica
 */
async function buscarEnCelda(celda, rubro) {
  let nextPageToken = null;
  let pagina = 1;
  let totalEncontrados = 0;
  let totalGuardados = 0;

  console.log(`   📍 Celda ${celda.codigo} | Keyword: "${rubro.keyword_google}"`);

  do {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${celda.latitud},${celda.longitud}&radius=${RADIO_CELDA}&keyword=${encodeURIComponent(rubro.keyword_google)}&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
      
      const response = await axios.get(url);
      const lugares = response.data.results;

      if (lugares.length === 0 && pagina === 1) {
        console.log(`      ℹ️ Sin resultados`);
        break;
      }

      console.log(`      📄 Página ${pagina}: ${lugares.length} lugares`);
      totalEncontrados += lugares.length;

      for (const lugar of lugares) {
        const detalles = await obtenerDetalles(lugar.place_id);

        if (!detalles.place_id) {
          console.warn(`      ⚠️ Lugar sin place_id, omitido`);
          continue;
        }

        const guardado = await guardarLugar(detalles, rubro.id, celda);
        if (guardado) {
          totalGuardados++;
          console.log(`      ✔️ ${detalles.name}`);
        }
        
        await new Promise(r => setTimeout(r, DELAY_ENTRE_REQUESTS));
      }

      nextPageToken = response.data.next_page_token;
      if (nextPageToken && pagina < MAX_PAGINAS) {
        pagina++;
        console.log(`      ⏳ Esperando siguiente página...`);
        await new Promise(r => setTimeout(r, DELAY_ENTRE_PAGINAS));
      } else {
        nextPageToken = null;
      }
    } catch (error) {
      console.error(`      ❌ Error en búsqueda:`, error.message);
      nextPageToken = null;
    }
  } while (nextPageToken);

  return { encontrados: totalEncontrados, guardados: totalGuardados };
}

/**
 * Función principal
 */
async function main() {
  console.log('🗺️  BÚSQUEDA CON SISTEMA DE GRILLAS\n');
  console.log('═'.repeat(60));

  // Solicitar nombre de grilla (o usar valor por defecto)
  const grillaNombre = process.argv[2] || 'conurbano_sur_v1_extendida';
  console.log(`📐 Grilla seleccionada: ${grillaNombre}`);
  console.log(`📏 Radio por celda: ${RADIO_CELDA}m`);
  console.log('═'.repeat(60));

  // Obtener rubros activos
  const rubros = await obtenerRubros();
  if (rubros.length === 0) {
    console.error('\n❌ No hay rubros activos para búsqueda.');
    console.log('💡 Configura rubros en ll_rubros con busqueda = 1');
    process.exit(1);
  }

  console.log(`\n🏷️  Rubros activos: ${rubros.length}`);
  rubros.forEach(r => console.log(`   - ${r.nombre} (${r.keyword_google})`));

  // Obtener celdas de la grilla
  const celdas = await obtenerCeldas(grillaNombre);
  if (celdas.length === 0) {
    console.error(`\n❌ No se encontraron celdas para la grilla "${grillaNombre}"`);
    console.log('💡 Genera la grilla con: node scripts/generar_grilla_conurbano.js');
    process.exit(1);
  }

  console.log(`\n🔲 Celdas encontradas: ${celdas.length}`);
  console.log('═'.repeat(60));

  // Estadísticas globales
  let totalCeldasProcesadas = 0;
  let totalCeldasOmitidas = 0;
  let totalLugaresEncontrados = 0;
  let totalLugaresGuardados = 0;

  // Procesar cada rubro
  for (const rubro of rubros) {
    console.log(`\n\n🔍 RUBRO: ${rubro.nombre}`);
    console.log('─'.repeat(60));

    let celdasProcesamientoRubro = 0;
    let celdasOmitidasRubro = 0;

    for (const celda of celdas) {
      // Verificar si ya fue buscada
      const yaBuscada = await fueYaBuscada(celda.id, rubro.keyword_google);
      
      if (yaBuscada) {
        console.log(`   ⏭️  Celda ${celda.codigo} ya buscada, omitida`);
        celdasOmitidasRubro++;
        totalCeldasOmitidas++;
        continue;
      }

      // Buscar en la celda
      const resultado = await buscarEnCelda(celda, rubro);
      
      // Registrar búsqueda
      await registrarBusqueda(celda.id, rubro.keyword_google, resultado.encontrados);
      
      celdasProcesamientoRubro++;
      totalCeldasProcesadas++;
      totalLugaresEncontrados += resultado.encontrados;
      totalLugaresGuardados += resultado.guardados;

      console.log(`      ✅ Encontrados: ${resultado.encontrados} | Guardados: ${resultado.guardados}`);
      
      // Pequeña pausa entre celdas
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n📊 Resumen ${rubro.nombre}:`);
    console.log(`   - Celdas procesadas: ${celdasProcesamientoRubro}`);
    console.log(`   - Celdas omitidas: ${celdasOmitidasRubro}`);
  }

  // Resumen final
  console.log('\n\n' + '═'.repeat(60));
  console.log('✅ BÚSQUEDA FINALIZADA');
  console.log('═'.repeat(60));
  console.log(`📐 Grilla: ${grillaNombre}`);
  console.log(`🔲 Total celdas procesadas: ${totalCeldasProcesadas}`);
  console.log(`⏭️  Total celdas omitidas: ${totalCeldasOmitidas}`);
  console.log(`📍 Total lugares encontrados: ${totalLugaresEncontrados}`);
  console.log(`💾 Total lugares guardados: ${totalLugaresGuardados}`);
  console.log('═'.repeat(60));

  process.exit(0);
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
  process.exit(1);
});

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { buscarEnCelda, obtenerCeldas, obtenerRubros };
