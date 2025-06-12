const mysql = require('mysql2/promise');
require('dotenv').config();

async function guardarDatoScrap(datos) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'iunaorg_dyd'
  });

  const query = `
    INSERT INTO ll_lugares_scrap 
    (place_id, nombre, tipo_dato, valor, fuente, observaciones)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.execute(query, [
      datos.place_id,
      datos.nombre || null,
      datos.tipo_dato,
      datos.valor,
      datos.fuente || 'manual',
      datos.observaciones || null
    ]);
    console.log('Dato insertado con ID:', result.insertId);
  } catch (error) {
    console.error('Error al guardar dato:', error.message);
  } finally {
    await connection.end();
  }
}

// Ejemplo de uso
guardarDatoScrap({
  place_id: 'ChIJ0Tz5Pp1KvJURgB2AcojA3_M',
  nombre: 'Bar El Sur',
  tipo_dato: 'instagram',
  valor: 'https://instagram.com/barelsur',
  fuente: 'manual',
  observaciones: 'Dato verificado por usuario'
});
