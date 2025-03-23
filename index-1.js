// index.js

require('dotenv').config();
const mysql = require('mysql2/promise');

// Crear conexión a la base de datos
async function conectarDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado a la base de datos');
    return connection;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

// Ejecutar función principal
(async () => {
  const db = await conectarDB();

  // Acá vamos a seguir desarrollando paso a paso...
})();
