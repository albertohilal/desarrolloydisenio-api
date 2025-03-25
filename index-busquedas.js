require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const LATITUD_CENTRO = -34.7609;
const LONGITUD_CENTRO = -58.4255;
const RADIO_METROS = 10000;

const log = [];
const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, `lugares-${dayjs().format('YYYY-MM-DD_HH-mm')}.log`);
let totalGlobal = 0;

async function main() {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const [rubros] = await connection.execute(
    'SELECT id, nombre, keyword_google FROM ll_rubros WHERE busqueda = 1'
  );

  for (const rubro of rubros) {
    let insertados = 0;
    log.push(`\n▶ Rubro: ${rubro.nombre} (${rubro.keyword_google})`);
    console.log(`\n▶ Buscando lugares para el rubro: ${rubro.nombre}`);

    const places = await buscarLugares(rubro.keyword_google);
    for (const place of places) {
      const fueInsertado = await guardarLugar(place, rubro.id, connection);
      if (fueInsertado) insertados++;
    }

    log.push(`✔ Insertados para ${rubro.nombre}: ${insertados}`);
    totalGlobal += insertados;
  }

  await connection.end();
  log.push(`\n✅ Total de lugares nuevos insertados: ${totalGlobal}`);
  fs.writeFileSync(logFile, log.join('\n'), 'utf-8');
  console.log(`\n✅ Finalizado. Log guardado en logs/${path.basename(logFile)}`);
}

async function buscarLugares(keyword) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const response = await axios.get(url, {
      params: {
        key: GOOGLE_API_KEY,
        location: `${LATITUD_CENTRO},${LONGITUD_CENTRO}`,
        radius: RADIO_METROS,
        keyword: keyword,
      },
    });

    if (response.data.status !== 'OK') {
      const error = `⚠️ Error de Google API (${keyword}): ${response.data.status}`;
      console.error(error);
      log.push(error);
      return [];
    }

    return response.data.results;
  } catch (error) {
    const msg = `❌ Error buscando lugares (${keyword}): ${error.message}`;
    console.error(msg);
    log.push(msg);
    return [];
  }
}

async function guardarLugar(place, rubro_id, connection) {
  try {
    const { place_id, name, vicinity, geometry } = place;

    const [rows] = await connection.execute(
      'SELECT COUNT(*) as total FROM ll_lugares WHERE place_id = ?',
      [place_id]
    );
    if (rows[0].total > 0) {
      const existe = `↪ Ya existe: ${name}`;
      console.log(existe);
      log.push(existe);
      return false;
    }

    await connection.execute(
      `INSERT INTO ll_lugares 
      (place_id, nombre, direccion, latitud, longitud, rubro_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        place_id,
        name,
        vicinity || '',
        geometry.location.lat,
        geometry.location.lng,
        rubro_id,
      ]
    );

    const guardado = `✔ Guardado: ${name}`;
    console.log(guardado);
    log.push(guardado);
    return true;
  } catch (error) {
    const msg = `❌ Error guardando lugar: ${error.message}`;
    console.error(msg);
    log.push(msg);
    return false;
  }
}

main();
