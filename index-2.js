require('dotenv').config();
const axios = require('axios');
const db = require('./db');

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const LOCATION = '-34.7609,-58.4062'; // Coordenadas de Lomas de Zamora
const RADIUS = 10000; // 10km
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Modificá este valor manualmente o automatizalo después
const rubroNombre = 'restaurantes';

async function obtenerRubroId(nombreRubro) {
  try {
    const [rows] = await db.query(
      'SELECT id FROM ll_rubros WHERE keyword_google = ? OR nombre = ? LIMIT 1',
      [nombreRubro, nombreRubro]
    );
    if (rows.length > 0) return rows[0].id;
    console.warn(`⚠️ No se encontró rubro_id para: ${nombreRubro}`);
    return null;
  } catch (error) {
    console.error('❌ Error al obtener rubro_id:', error.message);
    return null;
  }
}

async function buscarLugares() {
  try {
    console.log('✅ Conectado a la base de datos\n');

    const rubroId = await obtenerRubroId(rubroNombre);
    if (!rubroId) {
      console.error('❌ No se puede continuar sin un rubro_id válido');
      return;
    }

    const url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(rubroNombre)}&location=${LOCATION}&radius=${RADIUS}&key=${GOOGLE_API_KEY}`;
    console.log(`🔍 Conectando a la API de Google Places para buscar: ${rubroNombre}`);
    const response = await axios.get(url);
    const places = response.data.results;

    console.log(`✅ Se encontraron ${places.length} lugares para el rubro "${rubroNombre}"\n`);

    for (let i = 0; i < places.length; i++) {
      const lugar = places[i];
      const name = lugar.name || null;
      const address = lugar.formatted_address || null;
      const phone = null; // Se puede obtener con otro endpoint si lo habilitás
      const email = null;
      const website = lugar.website || null;
      const lat = lugar.geometry?.location?.lat || null;
      const lng = lugar.geometry?.location?.lng || null;
      const placeId = lugar.place_id;

      console.log(`${i + 1}. ${name} - ${address}`);

      try {
        await db.query(
          `INSERT IGNORE INTO ll_lugares 
           (place_id, nombre, direccion, telefono, email, sitio_web, latitud, longitud, rubro_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [placeId, name, address, phone, email, website, lat, lng, rubroId]
        );
      } catch (error) {
        console.error(`❌ Error al insertar "${name}":`, error.message);
      }
    }

    console.log('\n✅ Inserción finalizada.');
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    db.end();
  }
}

buscarLugares();
