const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Parser } = require('json2csv');

// Obtener celdas por zona (por parámetro)
router.get('/zona/:zona', async (req, res) => {
  const { zona } = req.params;
  console.log(`🛰️ [GET] /zona/${zona} → solicitud recibida`);
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

// Obtener celdas por zona (por query string)
router.get('/zona', async (req, res) => {
  const { zona } = req.query;
  if (!zona) return res.status(400).json({ error: 'Falta el parámetro zona' });
  console.log(`🛰️ [GET] /zona?zona=${zona} → solicitud recibida`);
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

// Actualizar estado de una sola celda
router.post('/actualizar-estado', async (req, res) => {
  const { id, estado } = req.body;
  try {
    await pool.query('UPDATE ll_grilla SET estado = ? WHERE id = ?', [estado, id]);
    console.log(`[POST] actualizar-estado: id: ${id}, estado: '${estado}'`);
    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ error: 'Error interno al actualizar estado' });
  }
});

// Actualizar múltiples celdas con mismo estado
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

// Exportar como CSV las celdas seleccionadas
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

// Ruta para obtener celdas ya buscadas (por rubro o keyword)
router.get('/buscadas', async (req, res) => {
  const { zona, rubro_id, keyword } = req.query;

  if (!zona || (!rubro_id && !keyword)) {
    return res.status(400).json({ error: 'Faltan parámetros: zona y rubro_id o keyword' });
  }

  if (rubro_id && keyword) {
    return res.status(400).json({ error: 'No se puede usar rubro_id y keyword al mismo tiempo' });
  }

  try {
    const [celdas] = await pool.query(
      'SELECT id FROM ll_grilla WHERE grilla_nombre = ?',
      [zona]
    );
    if (!celdas.length) return res.json([]);

    const ids = celdas.map(c => c.id);
    const placeholders = ids.map(() => '?').join(',');

    let query = '';
    let params = [];

    if (rubro_id) {
      query = `
        SELECT grilla_id FROM ll_busquedas_realizadas
        WHERE tipo = 'rubro' AND rubro_id = ? AND grilla_id IN (${placeholders})`;
      params = [rubro_id, ...ids];
    } else if (keyword) {
      query = `
        SELECT grilla_id FROM ll_busquedas_realizadas
        WHERE tipo = 'texto' AND keyword = ? AND grilla_id IN (${placeholders})`;
      params = [keyword, ...ids];
    }

    const [buscadas] = await pool.query(query, params);
    const resultado = buscadas.map(b => b.grilla_id);
    res.json(resultado);
  } catch (err) {
    console.error('❌ Error al obtener celdas ya buscadas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta avanzada: actualizar múltiples celdas con distintos estados
router.post('/actualizar-estados', async (req, res) => {
  const { celdas } = req.body;
  if (!Array.isArray(celdas) || !celdas.length) {
    return res.status(400).json({ error: 'Falta array de celdas con estado' });
  }

  try {
    await Promise.all(
      celdas.map(({ id, estado }) =>
        pool.query('UPDATE ll_grilla SET estado = ? WHERE id = ?', [estado, id])
      )
    );
    res.json({ ok: true, actualizadas: celdas.length });
  } catch (err) {
    console.error('❌ Error al actualizar estados múltiples:', err);
    res.status(500).json({ error: 'Error interno al actualizar celdas' });
  }
});

module.exports = router;
