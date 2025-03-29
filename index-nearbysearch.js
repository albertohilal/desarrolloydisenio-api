require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

async function obtenerRubros() {
  const connection = await mysql.createConnection(connectionConfig);
  const [rows] = await connection.execute(
    'SELECT id, keyword_google FROM ll_rubros WHERE busqueda = 1'
  );
  await connection.end();
  return rows;
}

async function guardarLugar(lugar, rubroId) {
  const connection = await mysql.createConnection(connectionConfig);
  try {
    await connection.execute(
      `INSERT IGNORE INTO ll_lugares
      (place_id, nombre, direccion, latitud, longitud, telefono, sitio_web, email, rubro_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lugar.place_id,
        lugar.name,
        lugar.vicinity || '',
        lugar.geometry?.location.lat || null,
        lugar.geometry?.location.lng || null,
        lugar.formatted_phone_number || '',
        lugar.website || '',
        lugar.email || '',
        rubroId
      ]
    );
  } catch (err) {
    console.error('Error al guardar lugar en la base de datos:', err);
  } finally {
    await connection.end();
  }
}

async function buscarLugaresNearby(rubro) {
  const location = '-34.7607662,-58.4083934'; // Lomas de Zamora centro
  const radius = 10000;
  let nextPageToken = null;

  do {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${rubro.keyword_google}&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
    const response = await axios.get(url);
    const lugares = response.data.results;

    for (const lugar of lugares) {
      await guardarLugar(lugar, rubro.id);
    }

    nextPageToken = response.data.next_page_token;
    if (nextPageToken) await new Promise(r => setTimeout(r, 2000));
  } while (nextPageToken);
}

async function main() {
  const rubros = await obtenerRubros();
  for (const rubro of rubros) {
    console.log(`Buscando lugares para rubro: ${rubro.keyword_google}`);
    await buscarLugaresNearby(rubro);
  }
}

main();
