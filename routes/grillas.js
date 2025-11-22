const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las zonas
router.get('/zonas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ll_zonas ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener zonas:', error);
    res.status(500).json({ error: 'Error al cargar zonas' });
  }
});

// Obtener todas las celdas de una grilla por nombre
router.get('/:nombre', async (req, res) => {
  const nombre = req.params.nombre;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ?',
      [nombre]
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener la grilla:', error);
    res.status(500).json({ error: 'Error interno al cargar grilla' });
  }
});

// Obtener códigos de celdas ya buscadas para un keyword y grilla_nombre
router.get('/celdas-ya-buscadas', async (req, res) => {
  try {
    const keyword = (req.query.keyword || '').trim().toLowerCase();
    const grillaNombre = (req.query.grilla_nombre || '').trim();

    if (!keyword || !grillaNombre) {
      return res.status(400).json({ error: 'Faltan parámetros: keyword y grilla_nombre' });
    }

    const [rows] = await pool.query(`
      SELECT g.codigo
      FROM ll_busquedas_realizadas b
      JOIN ll_grilla g ON b.grilla_id = g.id
      WHERE LOWER(TRIM(b.keyword)) = ? AND g.grilla_nombre = ?
    `, [keyword, grillaNombre]);

    const codigos = rows.map(r => r.codigo);
    res.json(codigos);
  } catch (err) {
    console.error('❌ Error al obtener celdas ya buscadas:', err);
    res.status(500).json({ error: 'Error interno al obtener celdas' });
  }
});

module.exports = router;
