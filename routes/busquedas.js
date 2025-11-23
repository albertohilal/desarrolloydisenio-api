const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

/**
 * Ejecutar script de búsqueda por grilla
 */
router.post('/ejecutar-grilla', async (req, res) => {
  const { rubroId, grilla } = req.body;
  
  if (!rubroId || !grilla) {
    return res.status(400).json({ error: 'Faltan parámetros: rubroId y grilla' });
  }
  
  console.log(`🔍 Ejecutando búsqueda: Rubro ${rubroId}, Grilla ${grilla}`);
  
  // Ejecutar script en background
  const scriptPath = path.join(__dirname, '../scripts/busqueda/buscar_con_grilla_v2.js');
  const proceso = spawn('node', [scriptPath, rubroId, grilla], {
    detached: true,
    stdio: 'ignore'
  });
  
  proceso.unref();
  
  res.json({ 
    success: true, 
    message: `Búsqueda iniciada para rubro ${rubroId}`,
    pid: proceso.pid
  });
});

/**
 * Ejecutar completar detalles
 */
router.post('/completar-detalles', async (req, res) => {
  const { limite } = req.body;
  
  console.log(`📝 Ejecutando completar detalles (límite: ${limite || 50})`);
  
  const scriptPath = path.join(__dirname, '../scripts/busqueda/completar_detalles.js');
  const proceso = spawn('node', [scriptPath, limite || 50], {
    detached: true,
    stdio: 'ignore'
  });
  
  proceso.unref();
  
  res.json({ 
    success: true, 
    message: `Completar detalles iniciado (límite: ${limite || 50})`,
    pid: proceso.pid
  });
});

module.exports = router;
