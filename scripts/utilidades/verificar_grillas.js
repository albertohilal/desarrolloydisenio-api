require('dotenv').config();
const pool = require('../../db');

async function verificarGrillas() {
  console.log('🗺️  VERIFICACIÓN DEL SISTEMA DE GRILLAS\n');
  console.log('═'.repeat(60));

  try {
    // Verificar tabla ll_grilla
    const [grillas] = await pool.query(`
      SELECT grilla_nombre, COUNT(*) as total_celdas 
      FROM ll_grilla 
      GROUP BY grilla_nombre
    `);

    if (grillas.length === 0) {
      console.log('❌ No hay grillas en la base de datos');
      console.log('\n💡 Para generar una grilla ejecuta:');
      console.log('   node scripts/generar_grilla_conurbano.js');
      return;
    }

    console.log(`✅ Grillas encontradas: ${grillas.length}\n`);
    grillas.forEach(g => {
      console.log(`   📐 ${g.grilla_nombre}: ${g.total_celdas} celdas`);
    });

    // Verificar tabla ll_busquedas_realizadas
    console.log('\n' + '─'.repeat(60));
    try {
      const [busquedas] = await pool.query(`
        SELECT COUNT(*) as total 
        FROM ll_busquedas_realizadas
      `);
      console.log(`✅ Tabla ll_busquedas_realizadas existe`);
      console.log(`   Búsquedas registradas: ${busquedas[0].total}`);
    } catch (error) {
      console.log('⚠️  Tabla ll_busquedas_realizadas no existe');
      console.log('\n💡 Creando tabla...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ll_busquedas_realizadas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          grilla_id INT NOT NULL,
          keyword VARCHAR(255) NOT NULL,
          resultados_encontrados INT DEFAULT 0,
          fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY busqueda_unica (grilla_id, keyword),
          FOREIGN KEY (grilla_id) REFERENCES ll_grilla(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ Tabla ll_busquedas_realizadas creada correctamente');
    }

    // Mostrar ejemplo de cómo usar el script
    console.log('\n' + '═'.repeat(60));
    console.log('📋 CÓMO USAR EL SISTEMA DE GRILLAS:');
    console.log('═'.repeat(60));
    console.log('\n1️⃣  Buscar con la grilla por defecto:');
    console.log('   node scripts/busqueda/buscar_con_grilla.js');
    console.log('\n2️⃣  Buscar con una grilla específica:');
    console.log(`   node scripts/busqueda/buscar_con_grilla.js "${grillas[0].grilla_nombre}"`);
    console.log('\n3️⃣  Ver celdas ya buscadas:');
    console.log('   node scripts/obtener_celdas_ya_buscadas.js');
    console.log('\n' + '═'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

verificarGrillas();
