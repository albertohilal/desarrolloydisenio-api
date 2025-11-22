require('dotenv').config();
const axios = require('axios');
const db = require('./db');

// Utilidad para evitar undefined
function safe(value) {
  return typeof value !== 'undefined' ? value : null;
}

// Keywords para buscar tatuadores
const KEYWORDS_TATTOO = [
  'tattoo shop',
  'tattoo studio', 
  'tattoo artist',
  'tatuajes',
  'estudio de tatuajes'
];

async function obtenerZonas() {
  const [rows] = await db.execute("SELECT id, nombre, latitud, longitud FROM ll_zonas WHERE activo = 1 AND busqueda = 1");
  return rows;
}

async function obtenerOCrearRubroTattoo(keyword) {
  // Buscar si ya existe el rubro
  const [existing] = await db.execute(
    "SELECT id, keyword_google FROM ll_rubros WHERE keyword_google = ?",
    [keyword]
  );

  if (existing.length > 0) {
    return existing[0];
  }

  // Si no existe, crearlo
  const [result] = await db.execute(
    "INSERT INTO ll_rubros (nombre, keyword_google, busqueda) VALUES (?, ?, 1)",
    [`Tatuadores - ${keyword}`, keyword]
  );

  console.log(`✨ Rubro creado: ${keyword} [ID: ${result.insertId}]`);
  
  return {
    id: result.insertId,
    keyword_google: keyword
  };
}

async function obtenerDetalles(placeId) {
  try {
    const fields = [
      "place_id", "name", "formatted_address", "vicinity", "formatted_phone_number", "website",
      "opening_hours", "geometry", "rating", "user_ratings_total", "price_level",
      "types", "business_status"
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result || {};
  } catch (err) {
    console.error(`❌ Error al obtener detalles de ${placeId}:`, err.message);
    return {};
  }
}

async function guardarLugar(detalles, rubro_id, zona_id) {
  try {
    await db.execute(`
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
      safe(detalles.place_id),
      safe(detalles.name),
      safe(detalles.formatted_address),
      safe(detalles.formatted_phone_number),
      safe(detalles.website),
      safe(detalles.geometry?.location?.lat),
      safe(detalles.geometry?.location?.lng),
      safe(rubro_id),
      safe(zona_id),
      safe(detalles.rating),
      safe(detalles.user_ratings_total),
      safe(detalles.types ? detalles.types.join(', ') : ''),
      safe(detalles.price_level),
      safe(detalles.opening_hours?.open_now ? 1 : 0)
    ]);
    console.log(`   ✔️ Guardado: ${detalles.name}`);
  } catch (err) {
    console.error(`   ❌ Error al guardar lugar:`, err.message);
  }
}

async function buscarTatuadores(keyword, zona, maxPaginas = 3) {
  let nextPageToken = null;
  let pagina = 1;
  let totalEncontrados = 0;

  do {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${zona.latitud},${zona.longitud}&radius=10000&keyword=${encodeURIComponent(keyword)}&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
      const response = await axios.get(url);
      const lugares = response.data.results;

      console.log(`   📄 Página ${pagina}: ${lugares.length} resultados`);

      // Obtener o crear el rubro
      const rubro = await obtenerOCrearRubroTattoo(keyword);

      for (const lugar of lugares) {
        const detalles = await obtenerDetalles(lugar.place_id);

        if (!detalles.place_id) {
          console.warn(`   ⚠️ Detalle sin place_id, se omite.`);
          continue;
        }

        await guardarLugar(detalles, rubro.id, zona.id);
        totalEncontrados++;
        
        // Pequeña pausa entre requests
        await new Promise(r => setTimeout(r, 300));
      }

      nextPageToken = response.data.next_page_token;
      if (nextPageToken && pagina < maxPaginas) {
        pagina++;
        console.log(`   ⏳ Esperando 2 segundos antes de la siguiente página...`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        nextPageToken = null;
      }
    } catch (error) {
      console.error(`   ❌ Error en búsqueda:`, error.message);
      nextPageToken = null;
    }
  } while (nextPageToken);

  return totalEncontrados;
}

async function main() {
  console.log('🎨 BÚSQUEDA DE TATUADORES\n');
  console.log('Keywords a buscar:', KEYWORDS_TATTOO.join(', '));
  console.log('─'.repeat(60));

  const zonas = await obtenerZonas();
  
  if (zonas.length === 0) {
    console.error('❌ No hay zonas activas configuradas para búsqueda.');
    console.log('\n💡 Solución: Configura zonas en la tabla ll_zonas con:');
    console.log('   - activo = 1');
    console.log('   - busqueda = 1');
    process.exit(1);
  }

  console.log(`\n📍 Zonas a buscar: ${zonas.length}`);
  zonas.forEach(z => console.log(`   - ${z.nombre}`));
  console.log('─'.repeat(60));

  let totalGeneral = 0;

  for (const zona of zonas) {
    console.log(`\n🌍 ZONA: ${zona.nombre}`);
    
    for (const keyword of KEYWORDS_TATTOO) {
      console.log(`\n🔍 Buscando: "${keyword}"`);
      const encontrados = await buscarTatuadores(keyword, zona);
      totalGeneral += encontrados;
      console.log(`   ✅ Total encontrados con "${keyword}": ${encontrados}`);
      
      // Pausa entre keywords
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ BÚSQUEDA FINALIZADA`);
  console.log(`📊 Total de tatuadores encontrados: ${totalGeneral}`);
  console.log('═'.repeat(60));
  
  process.exit(0);
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
  process.exit(1);
});

main();
