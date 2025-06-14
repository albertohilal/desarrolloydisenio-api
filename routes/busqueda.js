const express = require('express');
const router = express.Router();
const { buscarDesdeRubros } = require('../buscar_desde_rubros');
const { buscarDesdeTexto } = require('../buscar_texto');

router.post('/buscar-en-celdas', async (req, res) => {
  const { keyword, modo, celdas } = req.body;

  if (!keyword || !modo || !Array.isArray(celdas) || !celdas.length) {
    return res.status(400).json({ error: 'Faltan parámetros: keyword, modo o celdas' });
  }

  try {
    const celdasProcesadas = celdas.map(celda => {
      const [x, y] = celda.codigo.replace('x', '').split('_y').map(Number);
      return { ...celda, x, y };
    });

    if (modo === 'rubro') {
      await buscarDesdeRubros(celdasProcesadas, keyword);
    } else if (modo === 'texto') {
      await buscarDesdeTexto(celdasProcesadas, keyword);
    } else {
      return res.status(400).json({ error: 'Modo inválido: debe ser rubro o texto' });
    }

    res.json({ ok: true, mensaje: 'Búsqueda ejecutada correctamente' });
  } catch (error) {
    console.error('❌ Error al ejecutar búsqueda:', error.message);
    res.status(500).json({ error: 'Error interno al ejecutar búsqueda' });
  }
});

module.exports = router;
