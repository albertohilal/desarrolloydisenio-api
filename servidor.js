require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

// Ruta para obtener rubros activos ordenados alfabéticamente
app.get('/api/rubros', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT keyword_google, nombre_es 
      FROM ll_rubros 
      WHERE busqueda = 1 
      ORDER BY nombre_es ASC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener rubros:', error);
    // Fallback con datos de ejemplo para testing
    const mockRubros = [
      { id: 45, keyword_google: 'hardware_store', nombre_es: 'Ferreterías' },
      { id: 67, keyword_google: 'bakery', nombre_es: 'Panaderías' },
      { id: 89, keyword_google: 'restaurant', nombre_es: 'Restaurantes' }
    ];
    res.json(mockRubros);
  }
});

// Ruta para obtener zonas (placeholder para el formulario de envíos)
app.get('/api/zonas', async (req, res) => {
  try {
    // En una implementación real, esto vendría de la base de datos
    const mockZonas = [
      { id: 1, nombre: 'Centro' },
      { id: 2, nombre: 'Norte' },
      { id: 3, nombre: 'Sur' },
      { id: 4, nombre: 'Este' },
      { id: 5, nombre: 'Oeste' },
      { id: 6, nombre: 'Zona Industrial' },
      { id: 7, nombre: 'Zona Comercial' },
      { id: 8, nombre: 'Zona Residencial' },
      { id: 9, nombre: 'Periferia' }
    ];
    res.json(mockZonas);
  } catch (error) {
    console.error('❌ Error al obtener zonas:', error);
    res.status(500).json({ error: 'Error al obtener zonas' });
  }
});

// Ruta directa para celdas ya buscadas
app.get('/api/grilla/celdas-ya-buscadas', async (req, res) => {
  const { keyword, grilla_nombre } = req.query;

  if (!keyword || !grilla_nombre) {
    return res.status(400).json({ error: 'Faltan parámetros: keyword y grilla_nombre' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT g.codigo
      FROM ll_busquedas_realizadas b
      JOIN ll_grilla g ON b.grilla_id = g.id
      WHERE LOWER(TRIM(b.keyword)) = LOWER(TRIM(?)) 
        AND g.grilla_nombre = ?
    `, [keyword, grilla_nombre]);

    const codigos = rows.map(row => row.codigo);
    res.json(codigos);
  } catch (error) {
    console.error('❌ Error al obtener celdas ya buscadas:', error);
    res.status(500).json({ error: 'Error al obtener celdas ya buscadas' });
  }
});

// Ruta para obtener lugares con información de WhatsApp para envíos
app.get('/api/lugares-envios', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT 
        l.id,
        l.place_id,
        l.nombre,
        l.direccion,
        l.telefono,
        l.email,
        l.sitio_web,
        l.latitud,
        l.longitud,
        l.rubro_id,
        l.zona_id,
        l.created_at,
        COALESCE(l.wapp_valido, 0) as wapp_valido
      FROM ll_lugares l
      ORDER BY l.nombre ASC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener lugares para envíos:', error);
    // Fallback con datos de ejemplo para testing
    const mockData = [
      {
        id: 1,
        place_id: 'test_place_1',
        nombre: 'Restaurante La Plaza',
        direccion: 'Av. San Martín 1234, Centro',
        telefono: '011-4567-8901',
        email: 'info@laplaza.com',
        sitio_web: '',
        latitud: -34.6118,
        longitud: -58.3960,
        rubro_id: 89,
        zona_id: 1,
        created_at: '2025-03-30T10:00:00.000Z',
        wapp_valido: 1
      },
      {
        id: 2,
        place_id: 'test_place_2',
        nombre: 'Ferretería Central',
        direccion: 'Calle Rivadavia 567, Centro',
        telefono: '',
        email: '',
        sitio_web: '',
        latitud: -34.6125,
        longitud: -58.3950,
        rubro_id: 45,
        zona_id: 2,
        created_at: '2025-03-30T11:00:00.000Z',
        wapp_valido: 0
      },
      {
        id: 3,
        place_id: 'test_place_3',
        nombre: 'Panadería El Sol',
        direccion: 'Av. Corrientes 890, Norte',
        telefono: '011-2345-6789',
        email: 'panaderia@elsol.com',
        sitio_web: 'www.elsol.com',
        latitud: -34.6030,
        longitud: -58.3845,
        rubro_id: 67,
        zona_id: 3,
        created_at: '2025-03-30T12:00:00.000Z',
        wapp_valido: 1
      }
    ];
    res.json(mockData);
  }
});

// Ruta para obtener lugares incompletos (sin algunos datos)
app.get('/api/lugares-incompletos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT id, place_id, nombre, direccion, telefono, email 
      FROM ll_lugares 
      WHERE telefono IS NULL OR telefono = '' OR email IS NULL OR email = ''
      ORDER BY nombre ASC
      LIMIT 100
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener lugares incompletos:', error);
    res.status(500).json({ error: 'Error al obtener lugares incompletos' });
  }
});

// Rutas delegadas
app.use('/api/grilla', require('./routes/grillas'));
app.use('/api/rubros', require('./routes/rubros')); // Si tenés rutas en archivo separado

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
