const db = require('./db');

async function probarConexion() {
  try {
    const [rows] = await db.query('SELECT NOW() as ahora');
    console.log('Conectado a la base de datos. Hora:', rows[0].ahora);
  } catch (err) {
    console.error('Error de conexión:', err.message);
  }
}

probarConexion();
