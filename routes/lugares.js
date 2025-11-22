const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los lugares de la base de datos
router.get('/todos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id,
        l.place_id,
        l.nombre,
        l.direccion,
        l.telefono,
        l.sitio_web as website,
        l.latitud,
        l.longitud,
        l.rating,
        l.reviews as user_ratings_total,
        l.tipos,
        l.precio,
        l.abierto,
        l.zona_id,
        l.rubro_id,
        COALESCE(r.nombre_es, r.nombre) as rubro_nombre,
        r.keyword_google,
        z.nombre as zona_nombre
      FROM ll_lugares l
      LEFT JOIN ll_rubros r ON l.rubro_id = r.id
      LEFT JOIN ll_zonas z ON l.zona_id = z.id
      ORDER BY l.rating DESC, l.nombre
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener lugares:', error);
    res.status(500).json({ error: 'Error al cargar lugares' });
  }
});

// Obtener todos los tatuadores con información del rubro
router.get('/tatuadores', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id,
        l.place_id,
        l.nombre,
        l.direccion,
        l.telefono,
        l.sitio_web,
        l.latitud,
        l.longitud,
        l.rating,
        l.reviews,
        l.tipos,
        l.precio,
        l.abierto,
        l.zona_id,
        l.rubro_id,
        r.nombre as rubro_nombre,
        r.keyword_google,
        z.nombre as zona_nombre
      FROM ll_lugares l
      LEFT JOIN ll_rubros r ON l.rubro_id = r.id
      LEFT JOIN ll_zonas z ON l.zona_id = z.id
      WHERE r.keyword_google LIKE '%tattoo%' OR r.keyword_google LIKE '%tatua%'
      ORDER BY l.rating DESC, l.nombre
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener tatuadores:', error);
    res.status(500).json({ error: 'Error al cargar tatuadores' });
  }
});

// Obtener tatuadores por zona
router.get('/tatuadores/zona/:zonaId', async (req, res) => {
  const { zonaId } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        r.nombre as rubro_nombre,
        z.nombre as zona_nombre
      FROM ll_lugares l
      LEFT JOIN ll_rubros r ON l.rubro_id = r.id
      LEFT JOIN ll_zonas z ON l.zona_id = z.id
      WHERE l.zona_id = ? 
        AND (r.keyword_google LIKE '%tattoo%' OR r.keyword_google LIKE '%tatua%')
      ORDER BY l.rating DESC
    `, [zonaId]);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error al cargar tatuadores' });
  }
});

module.exports = router;
