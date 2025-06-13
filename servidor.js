const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const axios = require('axios');

const { guardarDatoScrap } = require('./scripts/guardar_scrap');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Guardar scrap manual y actualizar ll_lugares si corresponde
app.post('/api/guardar-scrap', async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.place_id || !data.tipo_dato || !data.valor) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    await guardarDatoScrap(data);

    // Si es teléfono o sitio web, actualiza también ll_lugares
    if (['telefono', 'sitio_web'].includes(data.tipo_dato)) {
      const campo = data.tipo_dato;
      const valor = data.valor;
      await pool.query(
        `UPDATE ll_lugares SET ${campo} = ? WHERE place_id = ?`,
        [valor, data.place_id]
      );
    }

    res.status(200).json({ mensaje: 'Dato guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar scrap:', error.message);
    res.status(500).json({ mensaje: 'Error al guardar scrap' });
  }
});

// CORREGIDO: lugares incompletos reales
app.get('/api/lugares-incompletos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.place_id, l.nombre, l.direccion
      FROM ll_lugares l
      WHERE (
        (l.telefono IS NULL OR l.telefono = '')
        OR (l.sitio_web IS NULL OR l.sitio_web = '')
      )
      AND NOT EXISTS (
        SELECT 1 FROM ll_lugares_scrap s
        WHERE s.place_id = l.place_id
        AND s.tipo_dato IN ('telefono', 'sitio_web')
      )
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener lugares incompletos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Otros endpoints que ya tenías:

app.get('/api/grilla/:nombre', async (req, res) => {
  const nombre = req.params.nombre;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ll_grilla WHERE grilla_nombre = ?',
      [nombre]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la grilla:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/rubros-activos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT keyword_google, nombre_es FROM ll_rubros WHERE busqueda = 1 ORDER BY nombre_es'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener rubros activos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/celdas-ya-buscadas', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Falta el parámetro keyword' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT g.codigo FROM ll_busquedas_realizadas b JOIN ll_grilla g ON b.grilla_id = g.id WHERE b.keyword = ?',
      [keyword]
    );
    const codigos = rows.map(r => r.codigo);
    res.json(codigos);
  } catch (error) {
    console.error('Error al obtener celdas ya buscadas:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/grilla/:id', async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE ll_grilla SET estado = ? WHERE id = ?',
      [estado, id]
    );
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error al actualizar el estado:', error.message);
    res.status(500).json({ error: 'Error interno al actualizar' });
  }
});

app.post('/api/buscar-en-celdas', async (req, res) => {
  const { keyword, modo = 'rubro', celdas } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!keyword || !Array.isArray(celdas) || celdas.length === 0) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  try {
    let rubro_id = null;
    if (modo === 'rubro') {
      const [[rubro]] = await pool.query(
        'SELECT id FROM ll_rubros WHERE keyword_google = ? LIMIT 1',
        [keyword]
      );
      rubro_id = rubro?.id || null;
    }

    let lugaresInsertados = 0;

    for (const celda of celdas) {
      const [[grilla]] = await pool.query(
        'SELECT lat_centro, lng_centro FROM ll_grilla WHERE id = ?',
        [celda.id]
      );
      const { lat_centro, lng_centro } = grilla;

      const url = (modo === 'texto')
        ? `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat_centro},${lng_centro}&radius=1000&key=${apiKey}`
        : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat_centro},${lng_centro}&radius=1000&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

      const respuesta = await axios.get(url);
      const lugares = respuesta.data.results;

      for (const lugar of lugares) {
        const {
          place_id,
          name,
          vicinity,
          geometry,
          rating,
          user_ratings_total,
          types
        } = lugar;

        const [existe] = await pool.query(
          'SELECT id FROM ll_lugares WHERE place_id = ?',
          [place_id]
        );
        if (existe.length > 0) continue;

        const lat = geometry?.location?.lat || 0;
        const lng = geometry?.location?.lng || 0;

        const [[zona]] = await pool.query(
          `SELECT id FROM ll_zonas
           WHERE activo = 1
           ORDER BY ST_Distance_Sphere(POINT(longitud, latitud), POINT(?, ?)) ASC
           LIMIT 1`,
          [lng, lat]
        );
        const zona_id = zona?.id || null;

        await pool.query(
          `INSERT INTO ll_lugares (
            place_id, nombre, direccion, latitud, longitud,
            rating, reviews, tipos, rubro_id, zona_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            place_id,
            name || '',
            vicinity || '',
            lat,
            lng,
            rating || 0,
            user_ratings_total || 0,
            (types || []).join(','),
            rubro_id,
            zona_id
          ]
        );

        lugaresInsertados++;
      }

      await pool.query(
        'INSERT INTO ll_busquedas_realizadas (grilla_id, keyword, created_at) VALUES (?, ?, NOW())',
        [celda.id, keyword]
      );
    }

    res.json({ success: true, totalCeldas: celdas.length, lugaresInsertados });
  } catch (error) {
    console.error('❌ Error en buscar-en-celdas:', error.message);
    res.status(500).json({ error: 'Error interno en búsqueda de celdas' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor API escuchando en http://localhost:${PORT}`);
});
