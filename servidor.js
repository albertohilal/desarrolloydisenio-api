require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

// Ruta para obtener rubros activos ordenados alfabéticamente
app.get('/api/rubros', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT keyword_google, nombre_es 
      FROM ll_rubros 
      WHERE busqueda = 1 
      ORDER BY nombre_es ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener rubros:', error);
    res.status(500).json({ error: 'Error al obtener rubros' });
  }
});

// Ruta directa para celdas ya buscadas
app.get('/api/grilla/celdas-ya-buscadas', async (req, res) => {
  const { keyword, grilla_nombre } = req.query;

  if (!keyword || !grilla_nombre) {
    return res.status(400).json({ error: 'Faltan parámetros: keyword y grilla_nombre' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT g.codigo
      FROM ll_busquedas_realizadas b
      JOIN ll_grilla g ON b.grilla_id = g.id
      WHERE LOWER(TRIM(b.keyword)) = LOWER(TRIM(?)) 
        AND g.grilla_nombre = ?
    `, [keyword, grilla_nombre]);

    const codigos = rows.map(row => row.codigo);
    res.json(codigos);
  } catch (error) {
    console.error('❌ Error al obtener celdas ya buscadas:', error);
    res.status(500).json({ error: 'Error al obtener celdas ya buscadas' });
  }
});

// Rutas delegadas
app.use('/api/grilla', require('./routes/grillas'));
app.use('/api/rubros', require('./routes/rubros')); // Si tenés rutas en archivo separado

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
