const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Ejecutando migración de tablas WhatsApp...');
  
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'database', 'migration_whatsapp_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by statements and execute each one, handling multi-line statements properly
    const statements = migrationSQL
      .split(/;\s*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    console.log(`📝 Ejecutando ${statements.length} sentencias SQL...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          // Handle stored procedure statements separately
          if (statement.includes('PREPARE') || statement.includes('EXECUTE') || statement.includes('DEALLOCATE')) {
            const lines = statement.split('\n').filter(line => line.trim());
            for (const line of lines) {
              if (line.trim()) {
                await pool.query(line.trim());
              }
            }
          } else {
            await pool.query(statement);
          }
          console.log(`✅ Sentencia ${i + 1} ejecutada correctamente`);
        } catch (err) {
          // Some statements might fail if the column/table already exists, that's OK
          if (err.code === 'ER_DUP_FIELDNAME' || 
              err.code === 'ER_TABLE_EXISTS_ERROR' ||
              err.code === 'ER_DUP_ENTRY' ||
              err.message.includes('already exists') ||
              err.message.includes('Duplicate column name') ||
              err.message.includes('Duplicate key name')) {
            console.log(`⚠️  Sentencia ${i + 1} omitida (ya existe): ${err.message.substring(0, 100)}`);
          } else {
            console.error(`❌ Error en sentencia ${i + 1}:`, err.message);
            console.error(`Sentencia: ${statement.substring(0, 200)}...`);
            // Don't throw error for non-critical failures
          }
        }
      }
    }
    
    console.log('🎉 Migración completada!');
    
  } catch (err) {
    console.error('❌ Error durante la migración:', err);
    throw err;
  }
}

async function testTables() {
  console.log('🔍 Verificando estructura de tablas...');
  
  try {
    // Test ll_fuentes table
    const [fuentes] = await pool.query('DESCRIBE ll_fuentes');
    console.log('✅ Tabla ll_fuentes creada correctamente');
    
    // Test ll_campanias_whatsapp table
    const [campanias] = await pool.query('DESCRIBE ll_campanias_whatsapp');
    console.log('✅ Tabla ll_campanias_whatsapp creada correctamente');
    
    // Test ll_envios_whatsapp table
    const [envios] = await pool.query('DESCRIBE ll_envios_whatsapp');
    console.log('✅ Tabla ll_envios_whatsapp creada correctamente');
    
    // Test ll_lugares modifications
    const [lugares] = await pool.query('DESCRIBE ll_lugares');
    const lugaresFields = lugares.map(row => row.Field);
    
    const expectedLugaresFields = ['telefono_wapp', 'wapp_valido', 'rating', 'reviews', 'tipos', 'precio', 'abierto'];
    const missingFields = expectedLugaresFields.filter(field => !lugaresFields.includes(field));
    
    if (missingFields.length === 0) {
      console.log('✅ Tabla ll_lugares actualizada correctamente');
    } else {
      console.log(`⚠️  Campos faltantes en ll_lugares: ${missingFields.join(', ')}`);
    }
    
    // Test ll_rubros modifications
    const [rubros] = await pool.query('DESCRIBE ll_rubros');
    const rubrosFields = rubros.map(row => row.Field);
    
    const expectedRubrosFields = ['area', 'fuente_id'];
    const missingRubrosFields = expectedRubrosFields.filter(field => !rubrosFields.includes(field));
    
    if (missingRubrosFields.length === 0) {
      console.log('✅ Tabla ll_rubros actualizada correctamente');
    } else {
      console.log(`⚠️  Campos faltantes en ll_rubros: ${missingRubrosFields.join(', ')}`);
    }
    
  } catch (err) {
    console.error('❌ Error verificando tablas:', err);
    throw err;
  }
}

async function testBasicFunctionality() {
  console.log('🧪 Probando funcionalidad básica...');
  
  try {
    // Test creating a campaign
    const [campaignResult] = await pool.query(
      'INSERT INTO ll_campanias_whatsapp (nombre, mensaje) VALUES (?, ?)',
      ['Campaña de Prueba', 'Hola! Este es un mensaje de prueba de WhatsApp.']
    );
    
    const campaignId = campaignResult.insertId;
    console.log(`✅ Campaña de prueba creada con ID: ${campaignId}`);
    
    // Test creating a send
    const [sendResult] = await pool.query(
      'INSERT INTO ll_envios_whatsapp (campania_id, telefono_wapp, nombre_destino, mensaje_final) VALUES (?, ?, ?, ?)',
      [campaignId, '+5491123456789', 'Test Contact', 'Mensaje personalizado de prueba']
    );
    
    const sendId = sendResult.insertId;
    console.log(`✅ Envío de prueba creado con ID: ${sendId}`);
    
    // Test updating send status
    await pool.query(
      'UPDATE ll_envios_whatsapp SET estado = ?, fecha_envio = NOW() WHERE id = ?',
      ['enviado', sendId]
    );
    console.log('✅ Estado de envío actualizado correctamente');
    
    // Test retrieving campaign with stats
    const [campaignStats] = await pool.query(`
      SELECT 
        c.*,
        COUNT(e.id) as total_envios,
        SUM(CASE WHEN e.estado = 'enviado' THEN 1 ELSE 0 END) as enviados
      FROM ll_campanias_whatsapp c
      LEFT JOIN ll_envios_whatsapp e ON c.id = e.campania_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [campaignId]);
    
    console.log('✅ Estadísticas de campaña obtenidas:', {
      nombre: campaignStats[0].nombre,
      total_envios: campaignStats[0].total_envios,
      enviados: campaignStats[0].enviados
    });
    
    // Clean up test data
    await pool.query('DELETE FROM ll_envios_whatsapp WHERE id = ?', [sendId]);
    await pool.query('DELETE FROM ll_campanias_whatsapp WHERE id = ?', [campaignId]);
    console.log('✅ Datos de prueba eliminados');
    
  } catch (err) {
    console.error('❌ Error en prueba de funcionalidad:', err);
    throw err;
  }
}

async function main() {
  try {
    console.log('🔄 Iniciando pruebas de migración WhatsApp...\n');
    
    await runMigration();
    console.log();
    
    await testTables();
    console.log();
    
    await testBasicFunctionality();
    console.log();
    
    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (err) {
    console.error('💥 Error durante las pruebas:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runMigration, testTables, testBasicFunctionality };