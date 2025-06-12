const { buscarDesdeRubros } = require('./buscar_desde_rubros');

// Celdas de prueba nuevas (distintas a x0_y0, x25_y0, x50_y0)
const celdas = [
  { x: 0, y: 25 },
  { x: 25, y: 25 },
  { x: 50, y: 25 }
];

const keyword = "cafetería";

buscarDesdeRubros(celdas, keyword).then(() => {
  console.log("✅ Búsqueda por rubro finalizada.");
  process.exit();
});
