const mysql = require('mysql2/promise');
require('dotenv').config();

async function guardarDatoScrap(data) {
  const {
    place_id,
    nombre = null,
    tipo_dato,
    valor,
    fuente = 'manual',
    observaciones = null
  } = data;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  try {
    const query = `
      INSERT INTO ll_lugares_scrap 
      (place_id, nombre, tipo_dato, valor, fuente, observaciones, fecha_scrap)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await connection.execute(query, [
      place_id,
      nombre,
      tipo_dato,
      valor,
      fuente,
      observaciones
    ]);

    console.log('✅ Dato insertado con ID:', result.insertId);
    return result;
  } catch (error) {
    console.error('❌ Error al insertar scrap:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { guardarDatoScrap };
