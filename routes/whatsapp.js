const express = require('express');
const router = express.Router();
const pool = require('../db');

// ======================================
// WHATSAPP CAMPAIGNS ROUTES
// ======================================

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        nombre, 
        mensaje, 
        fecha_creacion, 
        estado,
        (SELECT COUNT(*) FROM ll_envios_whatsapp WHERE campania_id = ll_campanias_whatsapp.id) as total_envios,
        (SELECT COUNT(*) FROM ll_envios_whatsapp WHERE campania_id = ll_campanias_whatsapp.id AND estado = 'enviado') as enviados,
        (SELECT COUNT(*) FROM ll_envios_whatsapp WHERE campania_id = ll_campanias_whatsapp.id AND estado = 'error') as errores
      FROM ll_campanias_whatsapp 
      ORDER BY fecha_creacion DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener campañas:', err);
    res.status(500).json({ error: 'Error al obtener campañas' });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM ll_campanias_whatsapp WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Campaña no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener campaña:', err);
    res.status(500).json({ error: 'Error al obtener campaña' });
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  const { nombre, mensaje } = req.body;
  
  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO ll_campanias_whatsapp (nombre, mensaje) VALUES (?, ?)',
      [nombre, mensaje]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, 
      mensaje,
      estado: 'pendiente',
      message: 'Campaña creada exitosamente' 
    });
  } catch (err) {
    console.error('Error al crear campaña:', err);
    res.status(500).json({ error: 'Error al crear campaña' });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, mensaje, estado } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE ll_campanias_whatsapp SET nombre = ?, mensaje = ?, estado = ? WHERE id = ?',
      [nombre, mensaje, estado, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaña no encontrada' });
    }
    
    res.json({ message: 'Campaña actualizada exitosamente' });
  } catch (err) {
    console.error('Error al actualizar campaña:', err);
    res.status(500).json({ error: 'Error al actualizar campaña' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM ll_campanias_whatsapp WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaña no encontrada' });
    }
    
    res.json({ message: 'Campaña eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar campaña:', err);
    res.status(500).json({ error: 'Error al eliminar campaña' });
  }
});

// ======================================
// WHATSAPP SENDS ROUTES
// ======================================

// Get all sends for a campaign
router.get('/:id/envios', async (req, res) => {
  const { id } = req.params;
  const { estado, limit, offset } = req.query;
  
  try {
    let whereClause = 'WHERE campania_id = ?';
    let params = [id];
    
    if (estado) {
      whereClause += ' AND estado = ?';
      params.push(estado);
    }
    
    let limitClause = '';
    if (limit) {
      limitClause = ` LIMIT ${parseInt(limit)}`;
      if (offset) {
        limitClause += ` OFFSET ${parseInt(offset)}`;
      }
    }
    
    const [rows] = await pool.query(`
      SELECT 
        e.*,
        l.nombre as lugar_nombre,
        l.direccion as lugar_direccion
      FROM ll_envios_whatsapp e
      LEFT JOIN ll_lugares l ON e.lugar_id = l.id
      ${whereClause}
      ORDER BY e.fecha_envio DESC
      ${limitClause}
    `, params);
    
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener envíos:', err);
    res.status(500).json({ error: 'Error al obtener envíos' });
  }
});

// Create new send
router.post('/:id/envios', async (req, res) => {
  const { id: campania_id } = req.params;
  const { telefono_wapp, nombre_destino, mensaje_final, lugar_id } = req.body;
  
  if (!telefono_wapp) {
    return res.status(400).json({ error: 'Teléfono WhatsApp es requerido' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO ll_envios_whatsapp (campania_id, telefono_wapp, nombre_destino, mensaje_final, lugar_id) VALUES (?, ?, ?, ?, ?)',
      [campania_id, telefono_wapp, nombre_destino, mensaje_final, lugar_id]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      campania_id,
      telefono_wapp,
      nombre_destino,
      mensaje_final,
      lugar_id,
      estado: 'pendiente',
      message: 'Envío creado exitosamente' 
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un envío para este teléfono en esta campaña' });
    }
    console.error('Error al crear envío:', err);
    res.status(500).json({ error: 'Error al crear envío' });
  }
});

// Update send status
router.put('/envios/:envioId', async (req, res) => {
  const { envioId } = req.params;
  const { estado, fecha_envio } = req.body;
  
  try {
    const updateFields = ['estado = ?'];
    const params = [estado];
    
    if (fecha_envio) {
      updateFields.push('fecha_envio = ?');
      params.push(fecha_envio);
    } else if (estado === 'enviado') {
      updateFields.push('fecha_envio = NOW()');
    }
    
    params.push(envioId);
    
    const [result] = await pool.query(
      `UPDATE ll_envios_whatsapp SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }
    
    res.json({ message: 'Envío actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar envío:', err);
    res.status(500).json({ error: 'Error al actualizar envío' });
  }
});

// Bulk create sends from lugares with WhatsApp
router.post('/:id/envios/bulk', async (req, res) => {
  const { id: campania_id } = req.params;
  const { filtros = {} } = req.body;
  
  try {
    // Get campaign details
    const [campaign] = await pool.query('SELECT * FROM ll_campanias_whatsapp WHERE id = ?', [campania_id]);
    if (campaign.length === 0) {
      return res.status(404).json({ error: 'Campaña no encontrada' });
    }
    
    // Build WHERE clause for lugares filtering
    let whereClause = 'WHERE telefono_wapp IS NOT NULL AND telefono_wapp != ""';
    let params = [];
    
    if (filtros.rubro_id) {
      whereClause += ' AND rubro_id = ?';
      params.push(filtros.rubro_id);
    }
    
    if (filtros.zona_id) {
      whereClause += ' AND zona_id = ?';
      params.push(filtros.zona_id);
    }
    
    if (filtros.wapp_valido !== undefined) {
      whereClause += ' AND wapp_valido = ?';
      params.push(filtros.wapp_valido);
    }
    
    // Get lugares that match criteria and don't already have a send for this campaign
    const [lugares] = await pool.query(`
      SELECT l.id, l.nombre, l.telefono_wapp, l.direccion
      FROM ll_lugares l
      ${whereClause}
      AND l.id NOT IN (
        SELECT COALESCE(lugar_id, 0) FROM ll_envios_whatsapp 
        WHERE campania_id = ? AND lugar_id IS NOT NULL
      )
      AND l.telefono_wapp NOT IN (
        SELECT COALESCE(telefono_wapp, '') FROM ll_envios_whatsapp 
        WHERE campania_id = ? AND telefono_wapp IS NOT NULL
      )
    `, [...params, campania_id, campania_id]);
    
    if (lugares.length === 0) {
      return res.json({ message: 'No se encontraron lugares válidos para agregar', count: 0 });
    }
    
    // Create bulk insert
    const values = lugares.map(lugar => [
      campania_id,
      lugar.telefono_wapp,
      lugar.nombre,
      campaign[0].mensaje, // Use campaign message as base
      lugar.id
    ]);
    
    const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();
    
    const [result] = await pool.query(
      `INSERT INTO ll_envios_whatsapp (campania_id, telefono_wapp, nombre_destino, mensaje_final, lugar_id) VALUES ${placeholders}`,
      flatValues
    );
    
    res.json({ 
      message: `${result.affectedRows} envíos creados exitosamente`,
      count: result.affectedRows
    });
    
  } catch (err) {
    console.error('Error al crear envíos masivos:', err);
    res.status(500).json({ error: 'Error al crear envíos masivos' });
  }
});

module.exports = router;