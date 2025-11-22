require('dotenv').config();
const db = require('./db');

(async () => {
  try {
    console.log('🏷️  CONSULTANDO RUBROS EN LA BASE DE DATOS\n');
    console.log('═'.repeat(70));
    
    // Todas los rubros
    const [todos] = await db.execute('SELECT * FROM ll_rubros');
    console.log(`\nTotal de rubros en la BD: ${todos.length}`);
    
    // Rubros activos
    const [activos] = await db.execute('SELECT * FROM ll_rubros WHERE busqueda = 1');
    console.log(`Rubros activos (busqueda=1): ${activos.length}`);
    
    // Rubros de tatuajes
    const [tattoo] = await db.execute("SELECT * FROM ll_rubros WHERE keyword_google LIKE '%tattoo%' OR keyword_google LIKE '%tatua%'");
    console.log(`Rubros de tatuajes: ${tattoo.length}`);
    
    console.log('\n' + '─'.repeat(70));
    
    if (tattoo.length > 0) {
      console.log('\n🎨 RUBROS DE TATUAJES:\n');
      tattoo.forEach((rubro, index) => {
        console.log(`${index + 1}. [ID: ${rubro.id}] ${rubro.nombre || 'Sin nombre'}`);
        console.log(`   Keyword: ${rubro.keyword_google}`);
        console.log(`   Búsqueda activa: ${rubro.busqueda ? 'SÍ' : 'NO'}`);
        console.log('');
      });
    } else {
      console.log('\n⚠️  NO HAY RUBROS DE TATUAJES EN LA BD\n');
    }
    
    if (activos.length > 0) {
      console.log('\n✅ OTROS RUBROS ACTIVOS:\n');
      const otros = activos.filter(r => !r.keyword_google.includes('tattoo') && !r.keyword_google.includes('tatua'));
      otros.slice(0, 10).forEach(r => {
        console.log(`   [${r.id}] ${r.nombre || r.keyword_google}`);
      });
      if (otros.length > 10) {
        console.log(`   ... y ${otros.length - 10} más`);
      }
    }
    
    console.log('\n' + '═'.repeat(70));
    
    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
