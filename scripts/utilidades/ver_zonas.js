require('dotenv').config();
const db = require('./db');

(async () => {
  try {
    console.log('📍 CONSULTANDO ZONAS EN LA BASE DE DATOS\n');
    console.log('═'.repeat(70));
    
    // Todas las zonas
    const [todas] = await db.execute('SELECT * FROM ll_zonas');
    console.log(`\nTotal de zonas en la BD: ${todas.length}`);
    
    // Zonas activas
    const [activas] = await db.execute('SELECT * FROM ll_zonas WHERE activo = 1');
    console.log(`Zonas activas: ${activas.length}`);
    
    // Zonas activas para búsqueda
    const [busqueda] = await db.execute('SELECT * FROM ll_zonas WHERE activo = 1 AND busqueda = 1');
    console.log(`Zonas activas PARA BÚSQUEDA: ${busqueda.length}`);
    
    console.log('\n' + '─'.repeat(70));
    
    if (busqueda.length > 0) {
      console.log('\n🔍 ZONAS QUE SE USARÁN EN LA BÚSQUEDA:\n');
      busqueda.forEach((zona, index) => {
        console.log(`${index + 1}. [ID: ${zona.id}] ${zona.nombre}`);
        console.log(`   📍 Coordenadas: ${zona.latitud}, ${zona.longitud}`);
        console.log(`   ✅ Activo: ${zona.activo} | Búsqueda: ${zona.busqueda}`);
        console.log('');
      });
    } else {
      console.log('\n⚠️  NO HAY ZONAS ACTIVAS PARA BÚSQUEDA\n');
      console.log('Para activar zonas, actualiza la tabla ll_zonas:');
      console.log('UPDATE ll_zonas SET activo = 1, busqueda = 1 WHERE id = ?');
    }
    
    if (activas.length > 0 && busqueda.length === 0) {
      console.log('\n💡 Tienes zonas activas pero ninguna marcada para búsqueda:\n');
      activas.forEach(zona => {
        console.log(`   [${zona.id}] ${zona.nombre} - busqueda: ${zona.busqueda}`);
      });
    }
    
    if (todas.length > activas.length) {
      console.log(`\n📊 Zonas inactivas: ${todas.length - activas.length}`);
    }
    
    console.log('\n' + '═'.repeat(70));
    
    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 La conexión a la base de datos tardó demasiado.');
      console.log('   Verifica que el host sea accesible:', process.env.DB_HOST);
    }
    process.exit(1);
  }
})();
