const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // <-- Esta línea sirve archivos como cuadriculas.html

// Rutas API
const grillasRoutes = require('./routes/grillas');
const rubrosRoutes = require('./routes/rubros');

app.use('/api/grillas', grillasRoutes);
app.use('/api/rubros', rubrosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
