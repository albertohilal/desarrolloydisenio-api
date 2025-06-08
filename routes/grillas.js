const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta: Obtener grillas activas
router.get('/activas', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT grilla_nombre 
      FROM ll_grilla
      WHERE estado = 'pendiente'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener grillas activas:', error);
    res.status(500).json({ error: 'Error al obtener grillas activas' });
  }
});

// Ruta: Obtener cuadriculas de una grilla específica
router.get('/cuadriculas', async (req, res) => {
  const { grilla_nombre } = req.query;

  if (!grilla_nombre) {
    return res.status(400).json({ error: 'Falta grilla_nombre en los parámetros' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ? ORDER BY fila, columna',
      [grilla_nombre]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener cuadriculas:', error);
    res.status(500).json({ error: 'Error al obtener cuadriculas' });
  }
});

module.exports = router;
