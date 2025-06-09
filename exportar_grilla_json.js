require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

// Nombre de la grilla que querés exportar
const grillaNombre = 'conurbano_sur_v1_extendida';
const outputFile = `public/grilla-${grillaNombre}.json`;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    const [rows] = await connection.execute(
      `SELECT codigo, latitud, longitud, estado FROM ll_grilla WHERE grilla_nombre = ? ORDER BY fila, columna`,
      [grillaNombre]
    );

    fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2));
    console.log(`✅ Archivo exportado: ${outputFile} (${rows.length} celdas)`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error al exportar la grilla:', error);
  }
})();
