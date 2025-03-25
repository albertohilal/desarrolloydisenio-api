require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos (por ejemplo, rubros.html)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
const rubrosRoutes = require('./routes/rubros');
app.use('/api/rubros', rubrosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🛠️ API de Desarrollo y Diseño en funcionamiento');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});
