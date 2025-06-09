const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Parser } = require('json2csv');

// Ruta A: Obtener celdas por zona (parámetro en la ruta)
router.get('/zona/:zona', async (req, res) => {
  const { zona } = req.params;
  console.log(`🛰️ [GET] /zona/${zona} → solicitud recibida`); // LOG agregado
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ?',
      [zona]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener grilla por zona (params):', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta B: Obtener celdas por zona (query string: ?zona=...)
router.get('/zona', async (req, res) => {
  const { zona } = req.query;
  if (!zona) return res.status(400).json({ error: 'Falta el parámetro zona' });
  console.log(`🛰️ [GET] /zona?zona=${zona} → solicitud recibida`); // LOG agregado

  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ?',
      [zona]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener grilla por zona (query):', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar estado de una celda
router.post('/actualizar-estado', async (req, res) => {
  const { id, estado } = req.body;
  try {
    await pool.query('UPDATE ll_grilla SET estado = ? WHERE id = ?', [estado, id]);
    console.log(`[POST recibido] actualizar-estado: id: ${id}, estado: '${estado}'`);
    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ error: 'Error interno al actualizar estado' });
  }
});

// Exportar seleccionados
router.get('/exportar', async (req, res) => {
  const { zona } = req.query;
  try {
    const [rows] = await pool.query(
      'SELECT codigo, fila, columna, latitud, longitud FROM ll_grilla WHERE grilla_nombre = ? AND estado = "seleccionado"',
      [zona]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hay celdas seleccionadas' });
    }

    const parser = new Parser({ fields: ['codigo', 'fila', 'columna', 'latitud', 'longitud'] });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${zona}_seleccionados.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).json({ error: 'Error al exportar CSV' });
  }
});
// Al final de grillas.js, antes de module.exports
router.post('/seleccionar-multiples', async (req, res) => {
  const { ids, estado } = req.body;
  if (!Array.isArray(ids) || !estado) {
    return res.status(400).json({ error: 'Faltan parámetros: ids (array) y estado' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE ll_grilla SET estado = ? WHERE id IN (${placeholders})`;

  try {
    await pool.query(sql, [estado, ...ids]);
    console.log(`📌 ${ids.length} celdas actualizadas a estado "${estado}"`);
    res.json({ actualizadas: ids.length });
  } catch (err) {
    console.error('Error al actualizar múltiples celdas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


module.exports = router;
