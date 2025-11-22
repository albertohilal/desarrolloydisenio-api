require('dotenv').config();
const pool = require('../../db');

async function mostrarEstadoGrillas() {
  console.log('🗺️  ESTADO DE GRILLAS PARA BÚSQUEDA\n');
  console.log('═'.repeat(70));

  try {
    // Obtener información de grillas
    const [grillas] = await pool.query(`
      SELECT 
        grilla_nombre,
        COUNT(*) as total_celdas,
        SUM(CASE WHEN estado IN ('pendiente', 'seleccionado', 'revisar') THEN 1 ELSE 0 END) as celdas_habilitadas,
        SUM(CASE WHEN estado = 'descartado' THEN 1 ELSE 0 END) as celdas_descartadas,
        MIN(lat1) as lat_min,
        MAX(lat2) as lat_max,
        MIN(lng1) as lng_min,
        MAX(lng2) as lng_max
      FROM ll_grilla 
      GROUP BY grilla_nombre
    `);

    if (grillas.length === 0) {
      console.log('❌ No hay grillas en la base de datos\n');
      return;
    }

    console.log(`📐 Grillas disponibles: ${grillas.length}\n`);

    for (const grilla of grillas) {
      console.log(`\n${'─'.repeat(70)}`);
      console.log(`📋 GRILLA: ${grilla.grilla_nombre}`);
      console.log(`${'─'.repeat(70)}`);
      console.log(`   🔲 Total de celdas: ${grilla.total_celdas}`);
      console.log(`   ✅ Celdas habilitadas (pendiente/seleccionado/revisar): ${grilla.celdas_habilitadas}`);
      console.log(`   ❌ Celdas descartadas: ${grilla.celdas_descartadas}`);
      console.log(`   📍 Área de cobertura:`);
      console.log(`      Latitud:  ${grilla.lat_min.toFixed(6)} a ${grilla.lat_max.toFixed(6)}`);
      console.log(`      Longitud: ${grilla.lng_min.toFixed(6)} a ${grilla.lng_max.toFixed(6)}`);

      // Obtener rubros activos
      const [rubros] = await pool.query(`
        SELECT id, nombre, keyword_google 
        FROM ll_rubros 
        WHERE busqueda = 1
      `);

      console.log(`\n   🏷️  Rubros activos para búsqueda: ${rubros.length}`);

      if (rubros.length === 0) {
        console.log('      ⚠️  No hay rubros activos (busqueda = 1)');
        continue;
      }

      // Estadísticas por rubro
      console.log('\n   📊 Estado de búsqueda por rubro:');
      console.log('   ' + '─'.repeat(66));
      console.log('   Rubro                          Keyword              Buscadas  Pendientes');
      console.log('   ' + '─'.repeat(66));

      for (const rubro of rubros) {
        // Contar celdas ya buscadas para este rubro (solo en celdas habilitadas)
        const [buscadas] = await pool.query(`
          SELECT COUNT(DISTINCT b.grilla_id) as total
          FROM ll_busquedas_realizadas b
          JOIN ll_grilla g ON b.grilla_id = g.id
          WHERE g.grilla_nombre = ? 
            AND b.keyword = ?
            AND g.estado IN ('pendiente', 'seleccionado', 'revisar')
        `, [grilla.grilla_nombre, rubro.keyword_google]);

        const celdasBuscadas = buscadas[0].total;
        const celdasPendientes = grilla.celdas_habilitadas - celdasBuscadas;
        const porcentaje = grilla.celdas_habilitadas > 0 
          ? ((celdasBuscadas / grilla.celdas_habilitadas) * 100).toFixed(1)
          : '0.0';

        const nombreCorto = rubro.nombre.substring(0, 28).padEnd(28);
        const keywordCorto = rubro.keyword_google.substring(0, 18).padEnd(18);
        const buscadasStr = `${celdasBuscadas}`.padStart(8);
        const pendientesStr = `${celdasPendientes}`.padStart(10);

        console.log(`   ${nombreCorto}  ${keywordCorto}  ${buscadasStr}  ${pendientesStr}  (${porcentaje}%)`);
      }

      // Resumen total
      const [totalBuscadas] = await pool.query(`
        SELECT COUNT(DISTINCT CONCAT(grilla_id, '-', keyword)) as total
        FROM ll_busquedas_realizadas b
        JOIN ll_grilla g ON b.grilla_id = g.id
        WHERE g.grilla_nombre = ?
          AND g.estado IN ('pendiente', 'seleccionado', 'revisar')
      `, [grilla.grilla_nombre]);

      const totalPosiblesBusquedas = grilla.celdas_habilitadas * rubros.length;
      const realizadas = totalBuscadas[0].total;
      const pendientes = totalPosiblesBusquedas - realizadas;
      const porcentajeTotal = totalPosiblesBusquedas > 0
        ? ((realizadas / totalPosiblesBusquedas) * 100).toFixed(1)
        : '0.0';

      console.log('   ' + '─'.repeat(66));
      console.log(`   TOTAL GENERAL (solo habilitadas):                  ${realizadas}/${totalPosiblesBusquedas} (${porcentajeTotal}%)`);
      console.log(`   Búsquedas pendientes: ${pendientes}`);
    }

    // Información de costos estimados
    console.log('\n\n' + '═'.repeat(70));
    console.log('💰 ESTIMACIÓN DE COSTOS (si completas todas las búsquedas habilitadas):');
    console.log('═'.repeat(70));

    const [rubrosActivos] = await pool.query('SELECT COUNT(*) as total FROM ll_rubros WHERE busqueda = 1');
    const [celdasHabilitadas] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM ll_grilla 
      WHERE estado IN ('pendiente', 'seleccionado', 'revisar')
    `);
    const totalGrilla = celdasHabilitadas[0].total;
    const totalRubros = rubrosActivos[0].total;
    const totalBusquedas = totalGrilla * totalRubros;

    // Costos aproximados de Google Places API
    const costoPorBusqueda = 0.032; // $0.032 por Nearby Search
    const costoDetalles = 0.017; // $0.017 por Place Details (básico)
    const promedioResultadosPorBusqueda = 20; // Estimado

    const costoTotal = (totalBusquedas * costoPorBusqueda) + 
                       (totalBusquedas * promedioResultadosPorBusqueda * costoDetalles);

    console.log(`   🔲 Celdas totales: ${totalGrilla}`);
    console.log(`   🏷️  Rubros activos: ${totalRubros}`);
    console.log(`   🔍 Búsquedas totales necesarias: ${totalBusquedas}`);
    console.log(`   💵 Costo estimado total: $${costoTotal.toFixed(2)} USD`);
    console.log(`      (Nearby Search: $${(totalBusquedas * costoPorBusqueda).toFixed(2)} + Details: $${(totalBusquedas * promedioResultadosPorBusqueda * costoDetalles).toFixed(2)})`);

    console.log('\n' + '═'.repeat(70));
    console.log('📝 NOTAS:');
    console.log('═'.repeat(70));
    console.log('   • Las búsquedas ya realizadas NO se volverán a ejecutar');
    console.log('   • El costo real dependerá de los resultados encontrados');
    console.log('   • Cada búsqueda puede tener hasta 3 páginas de resultados');
    console.log('   • Radio de búsqueda configurado: 750 metros por celda');
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

mostrarEstadoGrillas();
