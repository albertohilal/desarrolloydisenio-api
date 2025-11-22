const mysql = require('mysql2/promise');
const { config } = require('dotenv');
const dayjs = require('dayjs');
const { geodesic } = require('geolib');
const geolib = require('geolib');
config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  console.log("🧨 Eliminando y creando tabla ll_grilla...");

  await connection.execute(`DROP TABLE IF EXISTS ll_grilla`);

  await connection.execute(`
    CREATE TABLE ll_grilla (
      id INT AUTO_INCREMENT PRIMARY KEY,
      grilla_nombre VARCHAR(100) NOT NULL,
      codigo VARCHAR(50) NOT NULL,
      fila INT NOT NULL,
      columna INT NOT NULL,
      lat1 DECIMAL(10,6) NOT NULL,
      lng1 DECIMAL(10,6) NOT NULL,
      lat2 DECIMAL(10,6) NOT NULL,
      lng2 DECIMAL(10,6) NOT NULL,
      lat_centro DECIMAL(10,6) NOT NULL,
      lng_centro DECIMAL(10,6) NOT NULL,
      estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("🧩 Generando grilla de 40x40...");

  const grilla_nombre = "conurbano_sur_v1_extendida";
  const estado = "pendiente";
  const created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const lat_centro = -34.760;
  const lng_centro = -58.406;
  const paso_km = 1;
  const celdas = 40;

  function move(lat, lng, dx_km, dy_km) {
    const north = geolib.computeDestinationPoint({ latitude: lat, longitude: lng }, dy_km * 1000, 0);
    const east = geolib.computeDestinationPoint(north, dx_km * 1000, 90);
    return { lat: east.latitude, lng: east.longitude };
  }

  const insertQuery = `
    INSERT INTO ll_grilla (
      grilla_nombre, codigo, fila, columna,
      lat1, lng1, lat2, lng2,
      lat_centro, lng_centro, estado, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (let row = 0; row < celdas; row++) {
    for (let col = 0; col < celdas; col++) {
      const dx = (col - celdas / 2) * paso_km;
      const dy = (celdas / 2 - row) * paso_km;

      const esquina1 = move(lat_centro, lng_centro, dx, dy);
      const esquina2 = move(lat_centro, lng_centro, dx + 1, dy - 1);
      const centro = move(lat_centro, lng_centro, dx + 0.5, dy - 0.5);

      const codigo = `F${row + 1}_C${col + 1}`;

      await connection.execute(insertQuery, [
        grilla_nombre,
        codigo,
        row + 1,
        col + 1,
        esquina1.lat.toFixed(6),
        esquina1.lng.toFixed(6),
        esquina2.lat.toFixed(6),
        esquina2.lng.toFixed(6),
        centro.lat.toFixed(6),
        centro.lng.toFixed(6),
        estado,
        created_at
      ]);
    }
  }

  console.log("✅ Celdas insertadas correctamente.");
  await connection.end();
})();
