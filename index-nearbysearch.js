require('dotenv').config();
const axios = require('axios');
const db = require('./db');

async function obtenerRubros() {
  const [rows] = await db.execute("SELECT id, keyword_google FROM ll_rubros WHERE busqueda = 1");
  return rows;
}

async function obtenerZonas() {
  const [rows] = await db.execute(`
    SELECT id, nombre, latitud, longitud
    FROM ll_zonas
    WHERE activo = 1 AND busqueda = 1
  `);
  return rows;
}


async function obtenerDetalles(placeId) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result || {};
  } catch (err) {
    console.error(`❌ Error al obtener detalles de ${placeId}:`, err.message);
    return {};
  }
}

async function guardarLugar(lugar, detalles, rubro_id, zona_id) {
  try {
    await db.execute(
      `INSERT INTO ll_lugares 
      (place_id, nombre, direccion, latitud, longitud, telefono, sitio_web, email, rubro_id, zona_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        nombre = VALUES(nombre),
        direccion = VALUES(direccion),
        telefono = VALUES(telefono),
        sitio_web = VALUES(sitio_web),
        latitud = VALUES(latitud),
        longitud = VALUES(longitud),
        rubro_id = VALUES(rubro_id),
        zona_id = VALUES(zona_id)`
      , [
        lugar.place_id,
        lugar.name || '',
        lugar.vicinity || '',
        lugar.geometry?.location.lat || null,
        lugar.geometry?.location.lng || null,
        detalles.formatted_phone_number || '',
        detalles.website || '',
        null, // email
        rubro_id,
        zona_id
      ]
    );
    console.log(`✔️ Guardado: ${lugar.name}`);
  } catch (err) {
    console.error(`❌ Error al guardar ${lugar.name}:`, err.message);
  }
}

async function buscarLugaresNearby(rubro, zona, maxPaginas = 3) {
  let nextPageToken = null;
  let pagina = 1;

  do {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${zona.latitud},${zona.longitud}&radius=10000&keyword=${rubro.keyword_google}&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;

    const response = await axios.get(url);
    const lugares = response.data.results;

    console.log(`📍 Zona: ${zona.nombre} | Rubro: ${rubro.keyword_google} | Página ${pagina}`);

    for (const lugar of lugares) {
      const detalles = await obtenerDetalles(lugar.place_id);
      await guardarLugar(lugar, detalles, rubro.id, zona.id);
    }

    nextPageToken = response.data.next_page_token;
    if (nextPageToken && pagina < maxPaginas) {
      pagina++;
      await new Promise(r => setTimeout(r, 2000));
    } else {
      nextPageToken = null;
    }
  } while (nextPageToken);
}

async function main() {
  const rubros = await obtenerRubros();
  const zonas = await obtenerZonas();

  for (const rubro of rubros) {
    for (const zona of zonas) {
      await buscarLugaresNearby(rubro, zona);
    }
  }

  console.log('✅ Finalizado');
}

main();
