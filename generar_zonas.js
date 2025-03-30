require('dotenv').config();
const axios = require('axios');
const db = require('./db');

// Lista de puntos geográficos (cuadrícula de 3x3)
const puntos = [
  { lat: -34.7697662, lng: -58.4193934 },
  { lat: -34.7697662, lng: -58.4083934 },
  { lat: -34.7697662, lng: -58.3973934 },
  { lat: -34.7607662, lng: -58.4193934 },
  { lat: -34.7607662, lng: -58.4083934 },
  { lat: -34.7607662, lng: -58.3973934 },
  { lat: -34.7517662, lng: -58.4193934 },
  { lat: -34.7517662, lng: -58.4083934 },
  { lat: -34.7517662, lng: -58.3973934 },
];

async function reverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`;
  const response = await axios.get(url);
  const resultados = response.data.results;

  if (resultados.length > 0) {
    return resultados[0].formatted_address;
  }
  return null;
}

async function guardarZona(nombre, lat, lng) {
  try {
    await db.execute(
      'INSERT INTO ll_zonas (nombre, latitud, longitud) VALUES (?, ?, ?)',
      [nombre, lat, lng]
    );
    console.log(`✔️ Zona insertada: ${nombre}`);
  } catch (error) {
    console.error('❌ Error al guardar zona:', error);
  }
}

async function generarZonas() {
  for (const punto of puntos) {
    const direccion = await reverseGeocode(punto.lat, punto.lng);
    if (direccion) {
      await guardarZona(direccion, punto.lat, punto.lng);
    } else {
      console.warn(`⚠️ Dirección no encontrada para ${punto.lat}, ${punto.lng}`);
    }
    await new Promise(r => setTimeout(r, 1000)); // evitar límite de uso de API
  }
}

generarZonas();
