require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuración de la grilla
const grillaNombre = 'conurbano_sur_v1_extendida';
const zona = 'AMBA extendido';
const descripcion = 'Grilla amplia para selección interactiva sobre Conurbano y alrededores';

// Coordenada de inicio (esquina noroeste)
const latInicio = -34.400000;
const lngInicio = -58.600000;

// Tamaño de celda (grados ≈ 1000m)
const tamañoCelda = 0.009;
const filas = 60;
const columnas = 40;
const BATCH_SIZE = 500;

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  console.log(`🧩 Generando grilla "${grillaNombre}" (${filas}x${columnas})...`);

  // ⚠️ Limpiar registros anteriores
  await connection.execute('DELETE FROM ll_grilla WHERE grilla_nombre = ?', [grillaNombre]);

  const valores = [];

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      const lat = latInicio - fila * tamañoCelda;
      const lng = lngInicio + columna * tamañoCelda;
      const codigo = `F${fila}_C${columna}`;
      valores.push([grillaNombre, codigo, fila, columna, lat, lng, 'pendiente']);
    }
  }

  for (let i = 0; i < valores.length; i += BATCH_SIZE) {
    const batch = valores.slice(i, i + BATCH_SIZE);
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
    const flatValues = batch.flat();

    await connection.execute(
      `INSERT INTO ll_grilla (grilla_nombre, codigo, fila, columna, latitud, longitud, estado)
       VALUES ${placeholders}`,
      flatValues
    );
  }

  // Registrar metadatos
  await connection.execute(
    `INSERT IGNORE INTO ll_grillas (nombre, zona, descripcion, activo)
     VALUES (?, ?, ?, 1)`,
    [grillaNombre, zona, descripcion]
  );

  console.log(`✅ Grilla "${grillaNombre}" generada con éxito (${valores.length} celdas)`);
  await connection.end();
})();
