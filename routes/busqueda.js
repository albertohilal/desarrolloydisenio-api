const express = require('express');
const router = express.Router();
const db = require('../db');
const { buscarDesdeRubros } = require('../buscar_desde_rubros');
const { buscarDesdeTexto } = require('../buscar_texto');

router.post('/buscar-en-celdas', async (req, res) => {
  const { keyword, modo, celdas } = req.body;

  if (!keyword || !modo || !Array.isArray(celdas) || !celdas.length) {
    return res.status(400).json({ error: 'Faltan parámetros: keyword, modo o celdas' });
  }

  try {
    // Preprocesar coordenadas
    const celdasProcesadas = celdas.map(celda => {
      const [x, y] = celda.codigo.replace('x', '').split('_y').map(Number);
      return { ...celda, x, y };
    });

    // Ejecutar el scraper
    if (modo === 'rubro') {
      await buscarDesdeRubros(celdasProcesadas, keyword);
    } else if (modo === 'texto') {
      await buscarDesdeTexto(celdasProcesadas, keyword);
    } else {
      return res.status(400).json({ error: 'Modo inválido: debe ser rubro o texto' });
    }

    // Insertar logs de búsqueda
    const connection = await db.getConnection();
    const insertQuery = `
      INSERT INTO ll_busquedas_realizadas (grilla_id, keyword, created_at)
      VALUES (?, ?, NOW())
    `;

    for (const celda of celdas) {
      await connection.query(insertQuery, [celda.id, keyword]);
    }

    connection.release();

    res.json({ ok: true, mensaje: 'Búsqueda ejecutada correctamente' });
  } catch (error) {
    console.error('❌ Error al ejecutar búsqueda:', error.message);
    res.status(500).json({ error: 'Error interno al ejecutar búsqueda' });
  }
});

module.exports = router;
