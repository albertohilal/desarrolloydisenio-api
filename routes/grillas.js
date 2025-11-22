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

// Actualizar una zona
router.put('/zonas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, latitud, longitud, busqueda, activo } = req.body;
  
  try {
    await pool.query(
      'UPDATE ll_zonas SET nombre = ?, latitud = ?, longitud = ?, busqueda = ?, activo = ? WHERE id = ?',
      [nombre, latitud, longitud, busqueda, activo, id]
    );
    res.json({ success: true, message: 'Zona actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar zona:', error);
    res.status(500).json({ error: 'Error al actualizar zona' });
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

// Obtener estados de celdas para un rubro específico
router.get('/estados/:grillaNombre/:rubroId', async (req, res) => {
  const { grillaNombre, rubroId } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT 
        g.id as grilla_id,
        g.codigo,
        g.lat1,
        g.lat2,
        g.lng1,
        g.lng2,
        COALESCE(gr.estado, 'pendiente') as estado,
        gr.fecha_modificacion
      FROM ll_grilla g
      LEFT JOIN ll_grilla_rubros gr ON g.id = gr.grilla_id AND gr.rubro_id = ?
      WHERE g.grilla_nombre = ?
      ORDER BY g.codigo
    `, [rubroId, grillaNombre]);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener estados:', error);
    res.status(500).json({ error: 'Error al cargar estados' });
  }
});

// Actualizar estado de una celda para un rubro
router.put('/estados/:grillaId/:rubroId', async (req, res) => {
  const { grillaId, rubroId } = req.params;
  const { estado } = req.body;
  
  const estadosValidos = ['pendiente', 'seleccionado', 'revisar', 'descartado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  
  try {
    await pool.query(`
      INSERT INTO ll_grilla_rubros (grilla_id, rubro_id, estado)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE estado = VALUES(estado)
    `, [grillaId, rubroId, estado]);
    
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Actualizar múltiples estados a la vez (OPTIMIZADO)
router.post('/estados/batch', async (req, res) => {
  const { actualizaciones } = req.body; // Array de {grilla_id, rubro_id, estado}
  
  if (!Array.isArray(actualizaciones) || actualizaciones.length === 0) {
    return res.status(400).json({ error: 'Se requiere array de actualizaciones' });
  }
  
  console.log(`📦 Procesando ${actualizaciones.length} actualizaciones...`);
  
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Agrupar por área para optimizar (procesar en chunks de 500)
      const chunkSize = 500;
      for (let i = 0; i < actualizaciones.length; i += chunkSize) {
        const chunk = actualizaciones.slice(i, i + chunkSize);
        const values = chunk.map(act => [act.grilla_id, act.rubro_id, act.estado]);
        
        await connection.query(`
          INSERT INTO ll_grilla_rubros (grilla_id, rubro_id, estado)
          VALUES ?
          ON DUPLICATE KEY UPDATE estado = VALUES(estado)
        `, [values]);
        
        console.log(`✅ Procesado chunk ${i + chunk.length}/${actualizaciones.length}`);
      }
      
      await connection.commit();
      console.log(`🎉 ${actualizaciones.length} estados actualizados exitosamente`);
      res.json({ success: true, message: `${actualizaciones.length} estados actualizados` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Error al actualizar estados batch:', error);
    res.status(500).json({ error: 'Error al actualizar estados' });
  }
});

module.exports = router;
