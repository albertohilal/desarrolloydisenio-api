const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iunaorg_dyd',
});

app.get('/api/grilla/:nombre', async (req, res) => {
  const nombre = req.params.nombre;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ?',
      [nombre]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la grilla:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});
