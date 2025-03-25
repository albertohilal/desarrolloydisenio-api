const express = require('express');
const router = express.Router();
const db = require('../db');  // Asegúrate de que tu conexión a la base de datos esté en db.js

// Obtener todos los rubros
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre_es, keyword_google, busqueda FROM ll_rubros');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener rubros:', error);
    res.status(500).json({ error: 'Error al obtener rubros' });
  }
});


// Actualizar un rubro
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_es, keyword_google, busqueda } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE ll_rubros SET nombre_es = ?, keyword_google = ?, busqueda = ? WHERE id = ?',
            [nombre_es, keyword_google, busqueda, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rubro no encontrado' });
        }
        res.json({ message: 'Rubro actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
