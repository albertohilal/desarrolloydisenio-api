const { buscarDesdeTexto } = require('./buscar_texto');

// Generamos un array de celdas de prueba
const celdas = [
  { x: 0, y: 0 },
  { x: 25, y: 0 },
  { x: 50, y: 0 }
];

const keyword = "bar";

buscarDesdeTexto(celdas, keyword).then(() => {
  console.log("✅ Búsqueda finalizada.");
  process.exit();
});

