const db = require('./db');
const axios = require('axios');

/**
 * Verifica si una celda ya fue buscada para la keyword dada.
 */
async function fueBuscada(celda, keyword) {
  const celda_id = `x${celda.x}_y${celda.y}`;
  const [rows] = await db.execute(
    "SELECT 1 FROM iunaorg_dyd.ll_busquedas WHERE celda_id = ? AND keyword_google = ?",
    [celda_id, keyword]
  );
  return rows.length > 0;
}

/**
 * Registra una nueva búsqueda de la keyword en la celda.
 */
async function registrarBusqueda(celda, keyword) {
  const celda_id = `x${celda.x}_y${celda.y}`;
  await db.execute(
    "INSERT INTO iunaorg_dyd.ll_busquedas (celda_id, keyword_google) VALUES (?, ?)",
    [celda_id, keyword]
  );
}

/**
 * Realiza una búsqueda textual por keyword sobre una lista de celdas.
 */
async function buscarDesdeTexto(celdas, keyword) {
  for (const celda of celdas) {
    const celda_id = `x${celda.x}_y${celda.y}`;

    if (await fueBuscada(celda, keyword)) {
      console.log(`❌ Ya buscada: ${celda_id} (${keyword})`);
      continue;
    }

    console.log(`🔎 Buscando texto "${keyword}" en celda ${celda_id}`);

    // Aquí iría tu lógica de búsqueda textual en la API:
    // const resultados = await buscarTextoGooglePlaces(celda, keyword);
    // await guardarLugaresEnDB(resultados);

    await registrarBusqueda(celda, keyword);
  }
}

module.exports = { buscarDesdeTexto };
