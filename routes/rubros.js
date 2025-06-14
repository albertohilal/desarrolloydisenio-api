const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ Importa directamente desde db.js

// Obtener todos los rubros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre_es, keyword_google, busqueda FROM ll_rubros');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener rubros:', err);
    res.status(500).json({ error: 'Error al obtener rubros' });
  }
});

// Actualizar un rubro
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_es, keyword_google, busqueda } = req.body;
  try {
    await pool.query(
      'UPDATE ll_rubros SET nombre_es = ?, keyword_google = ?, busqueda = ? WHERE id = ?',
      [nombre_es, keyword_google, busqueda, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error al actualizar rubro:', err);
    res.status(500).json({ error: 'Error al actualizar rubro' });
  }
});

module.exports = router;
