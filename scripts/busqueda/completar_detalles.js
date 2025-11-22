const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const [lugares] = await pool.query(
      `SELECT id, place_id FROM ll_lugares 
       WHERE (telefono IS NULL OR telefono = '') 
       OR (sitio_web IS NULL OR sitio_web = '')`
    );

    console.log(`🔍 Lugares incompletos: ${lugares.length}`);

    for (const lugar of lugares) {
      const { id, place_id } = lugar;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_phone_number,website&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const result = response.data.result;

        const telefono = result.formatted_phone_number || '';
        const sitio_web = result.website || '';

        await pool.query(
          'UPDATE ll_lugares SET telefono = ?, sitio_web = ? WHERE id = ?',
          [telefono, sitio_web, id]
        );

        console.log(`✅ Actualizado: ${place_id}`);
      } catch (err) {
        console.error(`❌ Error al obtener detalles de ${place_id}:`, err.message);
      }
    }

    console.log('✨ Proceso de actualización completado.');
    process.exit();
  } catch (err) {
    console.error('Error general:', err.message);
    process.exit(1);
  }
})();
