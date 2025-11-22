const fs = require("fs");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function main() {
  const grillaNombre = "conurbano_sur_v1_extendida";
  const descripcion = "Grilla amplia para selección interactiva sobre Conurbano Sur";
  const zona = "AMBA extendido";

  try {
    const data = JSON.parse(fs.readFileSync("grilla-conurbano_sur_v1_extendida.json", "utf8"));

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Eliminar celdas previas si ya existen
    await connection.execute("DELETE FROM ll_grilla WHERE grilla_nombre = ?", [grillaNombre]);

    // Insertar celdas nuevas
    for (const celda of data) {
      const { codigo, fila, columna, latitud, longitud } = celda;
      await connection.execute(
        "INSERT INTO ll_grilla (codigo, fila, columna, latitud, longitud, estado, grilla_nombre) VALUES (?, ?, ?, ?, ?, 'pendiente', ?)",
        [codigo, fila, columna, latitud, longitud, grillaNombre]
      );
    }

    // Insertar o actualizar la entrada en ll_grillas
    await connection.execute(`
      INSERT INTO ll_grillas (nombre, zona, descripcion, activo, created_at)
      VALUES (?, ?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE
        zona = VALUES(zona),
        descripcion = VALUES(descripcion),
        activo = 1
    `, [grillaNombre, zona, descripcion]);

    console.log(`✅ Grilla "${grillaNombre}" cargada con ${data.length} celdas.`);
    await connection.end();
  } catch (err) {
    console.error("❌ Error al cargar la grilla:", err.message);
  }
}

main();
