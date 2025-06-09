const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Parser } = require('json2csv');

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

// Ruta: Obtener zonas de la grilla "conurbano_sur"
router.get('/zonas', async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT fila, columna, latitud, longitud 
      FROM ll_grilla 
      WHERE grilla_nombre = 'conurbano_sur'
    `);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    res.status(500).json({ error: 'Error al obtener zonas' });
  }
});

// Ruta: Obtener grilla completa por zona (con estado)
router.get('/zona', async (req, res) => {
  const zona = req.query.zona || 'conurbano_sur';

  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ? ORDER BY fila, columna',
      [zona]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener grilla por zona:', error);
    res.status(500).json({ error: 'Error al obtener grilla' });
  }
});

// Ruta: Actualizar el estado de una celda (modificada con log)
router.post('/actualizar-estado', async (req, res) => {
  const { id, estado } = req.body;
  console.log('[POST recibido] actualizar-estado:', { id, estado }); // ✅ DEBUG LOG

  if (!id || !estado) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos (id, estado)' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE ll_grilla SET estado = ? WHERE id = ?',
      [estado, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Ruta: Exportar celdas seleccionadas a CSV
router.get('/exportar', async (req, res) => {
  const zona = req.query.zona;

  if (!zona) {
    return res.status(400).json({ error: 'Falta parámetro zona' });
  }

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
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    res.status(500).json({ error: 'Error al exportar CSV' });
  }
});

module.exports = router;
