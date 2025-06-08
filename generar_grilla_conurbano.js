
require('dotenv').config();
const db = require('./db');

const deltaLat = 0.009; // ~1000m
const deltaLng = 0.011; // ~1000m

const latStart = -34.60;  // norte (Avellaneda)
const latEnd = -35.10;    // sur (La Plata)
const lngStart = -58.60;  // oeste
const lngEnd = -57.80;    // este

const grillaNombre = 'conurbano_sur';

async function generarGrilla() {
  try {
    await db.execute('DELETE FROM ll_grilla WHERE grilla_nombre = ?', [grillaNombre]);
    console.log(`🧹 Eliminadas celdas existentes de grilla '${grillaNombre}'.`);

    let fila = 0;
    for (let lat = latStart; lat >= latEnd; lat -= deltaLat, fila++) {
      let columna = 0;
      for (let lng = lngStart; lng <= lngEnd; lng += deltaLng, columna++) {
        const centroLat = lat - deltaLat / 2;
        const centroLng = lng + deltaLng / 2;
        const codigo = `F${fila}_C${columna}`;

        await db.execute(
          'INSERT INTO ll_grilla (grilla_nombre, codigo, fila, columna, latitud, longitud, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [grillaNombre, codigo, fila, columna, centroLat, centroLng, 'pendiente']
        );
        console.log(`✅ Insertado: ${codigo}`);
      }
    }

    console.log('✅ Grilla generada exitosamente.');
  } catch (error) {
    console.error('❌ Error al generar grilla:', error.message);
  } finally {
    process.exit();
  }
}

generarGrilla();
