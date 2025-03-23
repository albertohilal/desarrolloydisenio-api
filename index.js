// index.js
require('dotenv').config();
const axios = require('axios');
const db = require('./db');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const RUBRO = 'restaurantes';
const RUBRO_ID = 1; // ← Ajusta según el ID en tu tabla ll_rubros
const LOCATION = '-34.7609,-58.4223'; // Coordenadas de Lomas de Zamora
const RADIUS = 10000; // 10km

async function buscarLugaresPorRubro(rubro, rubroId) {
  console.log(`📡 Conectando a la API de Google Places para buscar: ${rubro}`);

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LOCATION}&radius=${RADIUS}&keyword=${encodeURIComponent(rubro)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    const lugares = response.data.results;

    console.log(`✅ Se encontraron ${lugares.length} lugares para el rubro "${rubro}"\n`);

    let contador = 1;
    for (const lugar of lugares) {
      const nombre = lugar.name || null;
      const direccion = lugar.vicinity || null;
      const place_id = lugar.place_id;
      const latitud = lugar.geometry?.location?.lat || null;
      const longitud = lugar.geometry?.location?.lng || null;
      const sitio_web = null; // A obtener más adelante
      const telefono = null;  // A obtener con otra API o scraping
      const email = null;     // A obtener con scraping si existe

      console.log(`${contador++}. ${nombre} - ${direccion}`);

      // Insertar en la base de datos
      try {
        await db.execute(
          `INSERT IGNORE INTO ll_lugares (place_id, nombre, direccion, telefono, email, sitio_web, latitud, longitud, rubro_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [place_id, nombre, direccion, telefono, email, sitio_web, latitud, longitud, rubroId]
        );
      } catch (dbError) {
        console.error('❌ Error al insertar en la base de datos:', dbError.message);
      }
    }
  } catch (error) {
    console.error('❌ Error al consultar la API de Google Places:', error.message);
  }
}

// Ejecutar búsqueda
(async () => {
  try {
    console.log('✅ Conectado a la base de datos\n');
    await buscarLugaresPorRubro(RUBRO, RUBRO_ID);
    process.exit();
  } catch (err) {
    console.error('❌ Error general:', err);
    process.exit(1);
  }
})();
