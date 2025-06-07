require('dotenv').config();
const axios = require('axios');
const db = require('./db');

async function obtenerRubrosActivos() {
  const [rows] = await db.execute("SELECT id, keyword_google FROM ll_rubros WHERE busqueda = 1");
  return rows;
}

async function obtenerZonasActivas() {
  const [rows] = await db.execute("SELECT id, nombre, latitud, longitud FROM ll_zonas WHERE busqueda = 1");
  return rows;
}

async function guardarLugar(lugar, rubro_id, zona_id) {
  const query = `
    INSERT INTO ll_lugares (place_id, nombre, direccion, telefono, email, sitio_web, latitud, longitud, rubro_id, zona_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)
  `;

  try {
    await db.execute(query, [
      lugar.place_id || '',
      lugar.name || '',
      lugar.formatted_address || '',
      lugar.formatted_phone_number || '',
      null, // email no viene en textsearch
      lugar.website || '',
      lugar.geometry?.location.lat || 0,
      lugar.geometry?.location.lng || 0,
      rubro_id,
      zona_id
    ]);
    console.log(`✔️ Guardado: ${lugar.name}`);
  } catch (error) {
    console.error(`❌ Error al guardar lugar ${lugar.name}:`, error.message);
  }
}

async function buscarLugaresTextSearch(rubro, zona, maxPaginas = 3) {
  let nextPageToken = null;
  let pagina = 1;

  do {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${rubro.keyword_google}&location=${zona.latitud},${zona.longitud}&radius=10000&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;

    const response = await axios.get(url);
    const lugares = response.data.results;

    console.log(`🔍 Página ${pagina} | Rubro: ${rubro.keyword_google} | Zona: ${zona.nombre}`);

    for (const lugar of lugares) {
      await guardarLugar(lugar, rubro.id, zona.id);
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
  const rubros = await obtenerRubrosActivos();
  const zonas = await obtenerZonasActivas();

  for (const rubro of rubros) {
    for (const zona of zonas) {
      await buscarLugaresTextSearch(rubro, zona);
    }
  }

  console.log('✅ Búsquedas finalizadas');
}

main();
