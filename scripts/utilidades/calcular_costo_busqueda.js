// CALCULADORA DE COSTOS - Google Places API
// Ajusta estos valores según tu caso

const CONFIGURACION = {
  // ¿Cuántas zonas tienes activas para búsqueda?
  zonasActivas: 10, // ← AJUSTA ESTE NÚMERO
  
  // Keywords que buscará el script
  keywords: 5, // tattoo shop, tattoo studio, tattoo artist, tatuajes, estudio de tatuajes
  
  // Páginas máximas por búsqueda (el script usa 3)
  paginasPorBusqueda: 3,
  
  // Resultados promedio por página
  resultadosPorPagina: 20,
  
  // Precios Google Places API (USD - Noviembre 2024)
  precioNearbyPor1000: 32.00,
  precioDetailsPor1000: 17.00
};

console.log('💰 CALCULADORA DE COSTOS - BÚSQUEDA DE TATUADORES\n');
console.log('═'.repeat(70));

console.log('\n📋 CONFIGURACIÓN:');
console.log(`   Zonas activas: ${CONFIGURACION.zonasActivas}`);
console.log(`   Keywords: ${CONFIGURACION.keywords}`);
console.log(`   Páginas máx por búsqueda: ${CONFIGURACION.paginasPorBusqueda}`);
console.log(`   Resultados estimados por página: ${CONFIGURACION.resultadosPorPagina}`);

// Cálculos
const totalBusquedasNearby = 
  CONFIGURACION.zonasActivas * 
  CONFIGURACION.keywords * 
  CONFIGURACION.paginasPorBusqueda;

const lugaresEstimados = 
  CONFIGURACION.zonasActivas * 
  CONFIGURACION.keywords * 
  CONFIGURACION.resultadosPorPagina;

console.log('\n📊 REQUESTS ESTIMADOS:');
console.log(`   Nearby Search (máximo): ${totalBusquedasNearby} requests`);
console.log(`   Places Details (estimado): ${lugaresEstimados} requests`);

// Costos
const costoNearby = (totalBusquedasNearby / 1000) * CONFIGURACION.precioNearbyPor1000;
const costoDetails = (lugaresEstimados / 1000) * CONFIGURACION.precioDetailsPor1000;
const costoTotal = costoNearby + costoDetails;

console.log('\n💵 COSTO ESTIMADO (USD):');
console.log(`   Nearby Search: $${costoNearby.toFixed(2)}`);
console.log(`   Places Details: $${costoDetails.toFixed(2)}`);
console.log('   ' + '─'.repeat(40));
console.log(`   TOTAL ESTIMADO: $${costoTotal.toFixed(2)}`);

// Escenarios
console.log('\n📉 ESCENARIOS:');
console.log('\n   Mejor caso (50% menos resultados):');
const mejorCaso = costoTotal * 0.5;
console.log(`   → $${mejorCaso.toFixed(2)}`);

console.log('\n   Peor caso (con duplicados + reintentos):');
const peorCaso = costoTotal * 1.3;
console.log(`   → $${peorCaso.toFixed(2)}`);

console.log('\n⚠️  NOTAS IMPORTANTES:');
console.log('   • El costo real puede ser menor si hay menos resultados');
console.log('   • Los lugares duplicados NO generan nuevos inserts en BD');
console.log('   • Pero SÍ se llama a la API para obtener sus detalles');
console.log('   • Google da $200 de crédito gratis mensual');
console.log('   • El script tiene pausas para evitar límites de rate');

console.log('\n💡 RECOMENDACIONES:');
if (CONFIGURACION.zonasActivas > 20) {
  console.log('   ⚠️  Tienes muchas zonas. Considera empezar con 5-10 zonas');
}
if (costoTotal > 50) {
  console.log('   ⚠️  Costo alto. Reduce zonas o keywords primero');
} else if (costoTotal > 20) {
  console.log('   ⚡ Costo moderado. Verifica tu crédito de Google antes');
} else {
  console.log('   ✅ Costo bajo. Puedes ejecutar sin problemas');
}

console.log('\n═'.repeat(70));
console.log('\n🔧 Para cambiar parámetros, edita la variable CONFIGURACION en este archivo\n');
