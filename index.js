const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
const grillasRoutes = require('./routes/grillas');
app.use('/api/grillas', grillasRoutes);

const rubrosRoutes = require('./routes/rubros');
app.use('/api/rubros', rubrosRoutes);

const whatsappRoutes = require('./routes/whatsapp');
app.use('/api/whatsapp/campanias', whatsappRoutes);

// Redirección inicial opcional
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'grilla_mapa.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
