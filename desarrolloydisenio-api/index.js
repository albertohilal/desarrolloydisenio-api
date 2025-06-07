const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Crear pool de conexiones MySQL usando variables del .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // ⚠️ IMPORTANTE: asegúrate que esté definido en tu .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar el pool para usarlo en otras partes del proyecto
module.exports = { pool };

// Importar rutas y pasar el pool por inyección
const rubrosRoutes = require('./routes/rubros');
app.use('/api/rubros', rubrosRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});
