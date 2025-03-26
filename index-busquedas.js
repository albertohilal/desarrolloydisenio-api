require('dotenv').config();
const fetch = require('node-fetch');
const mysql = require('mysql2/promise');

const API_KEY = process.env.GOOGLE_API_KEY;
const UBICACION = '-34.760000,-58.400000';
const RADIO_METROS = 10000;

async function obtenerConexion() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
}

async function obtenerRubrosHabilitados(conn) {
  const [rows] = await conn.execute('SELECT id, keyword_google FROM ll_rubros WHERE busqueda = 1');
  return rows;
}

async function obtenerDetallesLugar(place_id) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_phone_number,website&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.result || {};
}

async function guardarLugar(conn, lugar) {
  const sql = `INSERT IGNORE INTO ll_lugares 
    (place_id, nombre, direccion, latitud, longitud, telefono, sitio_web, email, rubro_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const valores = [
    lugar.place_id,
    lugar.nombre,
    lugar.direccion,
    lugar.latitud,
    lugar.longitud,
    lugar.telefono,
    lugar.sitio_web,
    lugar.email,
    lugar.rubro_id
  ];

  try {
    await conn.execute(sql, valores);
  } catch (error) {
    console.error('Error al guardar lugar en la base de datos:', error);
  }
}

async function buscarLugaresPorRubro(keyword, conn, rubro_id) {
  let nextPageToken = null;
  let intento = 0;

  do {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${UBICACION}&radius=${RADIO_METROS}&key=${API_KEY}`;
    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
      await new Promise(r => setTimeout(r, 2000)); // Esperar para que el token esté activo
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        for (const lugar of data.results) {
          const place_id = lugar.place_id;
          const nombre = lugar.name;
          const direccion = lugar.formatted_address;
          const latitud = lugar.geometry.location.lat;
          const longitud = lugar.geometry.location.lng;

          const detalles = await obtenerDetallesLugar(place_id);
          const telefono = detalles.formatted_phone_number || null;
          const sitio_web = detalles.website || null;
          const email = null;

          await guardarLugar(conn, {
            place_id,
            nombre,
            direccion,
            latitud,
            longitud,
            telefono,
            sitio_web,
            email,
            rubro_id
          });
        }
      }

      nextPageToken = data.next_page_token || null;
    } catch (error) {
      console.error('Error al buscar lugares:', error);
      break;
    }

    intento++;
  } while (nextPageToken && intento < 3);
}

async function main() {
  const conn = await obtenerConexion();
  const rubros = await obtenerRubrosHabilitados(conn);

  for (const rubro of rubros) {
    console.log(`Buscando lugares para rubro: ${rubro.keyword_google}`);
    await buscarLugaresPorRubro(rubro.keyword_google, conn, rubro.id);
  }

  await conn.end();
}

main().catch(console.error);
