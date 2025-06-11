require('dotenv').config();
const axios = require('axios');
const db = require('./db');

function safe(value) {
  return typeof value !== 'undefined' ? value : null;
}

async function obtenerZonas() {
  const [rows] = await db.execute("SELECT id, nombre, latitud, longitud FROM ll_zonas WHERE activo = 1 AND busqueda = 1");
  return rows;
}

async function obtenerDetalles(placeId) {
  try {
    const fields = [
      "place_id", "name", "formatted_address", "vicinity", "formatted_phone_number", "website",
      "opening_hours", "geometry", "rating", "user_ratings_total", "price_level", "types"
    ].join(',');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result || {};
  } catch (err) {
    console.error(`❌ Error en Place Details:`, err.message);
    return {};
  }
}

async function guardarLugar(detalles, zona_id, keyword) {
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
        zona_id = VALUES(zona_id),
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
      null,
      zona_id,
      safe(detalles.rating),
      safe(detalles.user_ratings_total),
      safe(detalles.types ? detalles.types.join(', ') : ''),
      safe(detalles.price_level),
      safe(detalles.opening_hours?.open_now ? 1 : 0)
    ]);
    console.log(`✔️ Guardado: ${detalles.name}`);
  } catch (err) {
    console.error(`❌ Error al guardar lugar:`, err.message);
  }
}

async function registrarBusqueda(grilla_id, keyword) {
  await db.execute(`
    INSERT IGNORE INTO ll_busquedas_realizadas (grilla_id, tipo, keyword)
    VALUES (?, 'texto', ?)`, [grilla_id, keyword]);
}

async function yaFueBuscado(grilla_id, keyword) {
  const [rows] = await db.execute(`
    SELECT 1 FROM ll_busquedas_realizadas
    WHERE grilla_id = ? AND tipo = 'texto' AND keyword = ?`, [grilla_id, keyword]);
  return rows.length > 0;
}

async function buscarPorTexto(query, zona, maxPaginas = 3) {
  const grilla_id = zona.id;
  const yaExiste = await yaFueBuscado(grilla_id, query);
  if (yaExiste) {
    console.log(`⏭️ Ya buscado: "${query}" en zona ${zona.nombre}`);
    return;
  }

  let pagina = 1;
  let nextPageToken = null;

  do {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${zona.latitud},${zona.longitud}&radius=1000&key=${process.env.GOOGLE_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
    const response = await axios.get(url);
    const resultados = response.data.results;

    console.log(`🔎 "${query}" en zona: ${zona.nombre} | Página ${pagina}`);

    for (const lugar of resultados) {
      const detalles = await obtenerDetalles(lugar.place_id);
      if (!detalles.place_id) continue;
      await guardarLugar(detalles, zona.id, query);
    }

    nextPageToken = response.data.next_page_token;
    if (nextPageToken && pagina < maxPaginas) {
      pagina++;
      await new Promise(res => setTimeout(res, 2000));
    } else {
      nextPageToken = null;
    }
  } while (nextPageToken);

  await registrarBusqueda(grilla_id, query);
}

async function main() {
  const zonas = await obtenerZonas();
  const frase = process.argv[2];

  if (!frase) {
    console.error('❌ Ingresá una frase para buscar: node buscar_texto.js "clínica dental"');
    process.exit(1);
  }

  for (const zona of zonas) {
    await buscarPorTexto(frase, zona);
  }

  console.log('✅ Búsqueda completada.');
}

main();
