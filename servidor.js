require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

// Ruta: Obtener lugares incompletos
app.get('/api/lugares-incompletos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT l.place_id, l.nombre, l.direccion 
      FROM ll_lugares l
      WHERE NOT EXISTS (
        SELECT 1 FROM ll_lugares_scrap s WHERE s.place_id = l.place_id
      )
      ORDER BY l.nombre ASC;
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/lugares-incompletos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta: Guardar scrap manual
app.post('/api/guardar-scrap', async (req, res) => {
  const data = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO ll_lugares_scrap 
      (place_id, nombre, tipo_dato, valor, fuente, observaciones, fecha_scrap)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      data.place_id,
      data.nombre,
      data.tipo_dato,
      data.valor,
      data.fuente,
      data.observaciones
    ];
    await connection.execute(query, values);
    await connection.end();
    res.json({ ok: true, mensaje: 'Dato guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar scrap:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al guardar' });
  }
});

// ✅ Cargar las demás rutas
app.use('/api', require('./routes/rubros'));
app.use('/api/grilla', require('./routes/grillas'));
app.use('/api', require('./routes/busqueda'));

app.listen(port, () => {
  console.log(`✅ Servidor API escuchando en http://localhost:${port}`);
});
