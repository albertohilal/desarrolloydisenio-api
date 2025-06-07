require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');

const puntos = [
  { lat: -34.7614, lng: -58.3983 }, // Lomas de Zamora
  { lat: -34.7217, lng: -58.3925 }, // Banfield
  { lat: -34.6677, lng: -58.4056 }, // Lanús
  { lat: -34.6339, lng: -58.4108 }, // Avellaneda
  { lat: -34.7900, lng: -58.3880 }, // Temperley
];

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

async function obtenerRubros() {
  const connection = await mysql.createConnection(connectionConfig);
  const [rows] = await connection.execute('SELECT id, keyword_google FROM ll_rubros WHERE busqueda = 1');
  await connection.end();
  return rows;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarLugares(rubro, punto) {
  const lugaresTotales = [];
  let pagetoken = null;
  let intentos = 0;

  do {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${punto.lat},${punto.lng}&radius=10000&keyword=${encodeURIComponent(rubro.keyword_google)}&key=${process.env.GOOGLE_API_KEY}`;
    if (pagetoken) url += `&pagetoken=${pagetoken}`;

    if (pagetoken) await delay(2000); // Esperar antes de usar el token

    const response = await axios.get(url);
    const data = response.data;

    if (data.results && data.results.length > 0) {
      lugaresTotales.push(...data.results);
    }

    pagetoken = data.next_page_token || null;
    intentos++;
  } while (pagetoken && intentos < 3);

  return lugaresTotales;
}

async function guardarLugar(lugar, rubro_id) {
  const connection = await mysql.createConnection(connectionConfig);

  const sql = `
    INSERT IGNORE INTO ll_lugares (
      place_id, nombre, direccion, latitud, longitud, telefono, sitio_web, email, rubro_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    lugar.place_id,
    lugar.name || '',
    lugar.vicinity || '',
    lugar.geometry?.location?.lat || null,
    lugar.geometry?.location?.lng || null,
    '', // teléfono no viene en nearbysearch
    '', // sitio_web no viene en nearbysearch
    '', // email no viene en nearbysearch
    rubro_id,
  ];

  try {
    await connection.execute(sql, values);
  } catch (error) {
    console.error(`Error SQL: ${error.message}`);
  } finally {
    await connection.end();
  }
}

async function main() {
  const rubros = await obtenerRubros();

  for (const rubro of rubros) {
    for (const punto of puntos) {
      console.log(`Buscando lugares para rubro: ${rubro.keyword_google} en (${punto.lat},${punto.lng})`);
      const lugares = await buscarLugares(rubro, punto);

      for (const lugar of lugares) {
        await guardarLugar(lugar, rubro.id);
      }

      console.log(`Total guardados para este punto: ${lugares.length}`);
    }
  }

  console.log('Finalizado.');
}

main();
