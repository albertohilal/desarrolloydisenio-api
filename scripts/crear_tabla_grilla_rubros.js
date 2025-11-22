require('dotenv').config();
const pool = require('../db');

async function crearTablaGrillaRubros() {
  console.log('📋 CREANDO TABLA ll_grilla_rubros\n');
  console.log('═'.repeat(60));

  try {
    // Crear la tabla
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ll_grilla_rubros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        grilla_id INT NOT NULL,
        rubro_id INT NOT NULL,
        estado ENUM('pendiente', 'seleccionado', 'revisar', 'descartado') DEFAULT 'pendiente',
        fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY grilla_rubro_unico (grilla_id, rubro_id),
        FOREIGN KEY (grilla_id) REFERENCES ll_grilla(id) ON DELETE CASCADE,
        FOREIGN KEY (rubro_id) REFERENCES ll_rubros(id) ON DELETE CASCADE,
        INDEX idx_grilla (grilla_id),
        INDEX idx_rubro (rubro_id),
        INDEX idx_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tabla ll_grilla_rubros creada correctamente\n');

    // Verificar la estructura
    const [columns] = await pool.query('SHOW COLUMNS FROM ll_grilla_rubros');
    
    console.log('📊 Estructura de la tabla:\n');
    columns.forEach(col => {
      console.log(`   ${col.Field.padEnd(20)} ${col.Type.padEnd(30)} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('📝 INFORMACIÓN:');
    console.log('═'.repeat(60));
    console.log('Esta tabla permite configurar estados específicos de cada celda');
    console.log('para cada rubro, de forma independiente.\n');
    console.log('Estados disponibles:');
    console.log('  • pendiente    - Por defecto, aún no decidido');
    console.log('  • seleccionado - Habilitado para búsqueda');
    console.log('  • revisar      - Requiere análisis adicional');
    console.log('  • descartado   - No buscar en esta celda para este rubro\n');
    console.log('Ventaja: Una celda puede estar habilitada para restaurantes');
    console.log('pero descartada para tatuadores, optimizando las búsquedas.\n');
    console.log('═'.repeat(60));

    // Verificar si hay datos del estado actual en ll_grilla
    const [gridCount] = await pool.query('SELECT COUNT(*) as total FROM ll_grilla');
    const [rubroCount] = await pool.query('SELECT COUNT(*) as total FROM ll_rubros WHERE busqueda = 1');
    
    console.log('\n📈 ESTADÍSTICAS ACTUALES:');
    console.log('═'.repeat(60));
    console.log(`  Celdas en ll_grilla: ${gridCount[0].total}`);
    console.log(`  Rubros activos: ${rubroCount[0].total}`);
    console.log(`  Combinaciones posibles: ${gridCount[0].total * rubroCount[0].total}`);
    console.log('\n💡 Las combinaciones se crearán bajo demanda cuando uses el mapa');
    console.log('   o cuando ejecutes búsquedas.\n');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

crearTablaGrillaRubros();
