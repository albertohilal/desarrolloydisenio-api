const db = require('./db');

/**
 * Devuelve un array de IDs de celdas que ya fueron buscadas
 * para una keyword_google determinada.
 */
async function obtenerCeldasYaBuscadas(keyword) {
  try {
    const [rows] = await db.execute(
      "SELECT celda_id FROM iunaorg_dyd.ll_busquedas WHERE keyword_google = ?",
      [keyword]
    );
    return rows.map(row => row.celda_id);
  } catch (error) {
    console.error("Error en obtenerCeldasYaBuscadas:", error);
    return []; // En caso de error, devolvemos array vacío
  }
}

module.exports = { obtenerCeldasYaBuscadas };
