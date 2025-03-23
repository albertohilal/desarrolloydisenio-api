require('dotenv').config();
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const API_KEY = process.env.GOOGLE_API_KEY;
const location = '-34.7609,-58.4258'; // Lomas de Zamora
const radius = 10000;
const type = 'store'; // Podés cambiarlo por otro rubro

const csvWriter = createCsvWriter({
  path: 'places.csv',
  header: [
    {id: 'place_id', title: 'Place ID'},
    {id: 'name', title: 'Nombre'},
    {id: 'address', title: 'Dirección'},
    {id: 'phone', title: 'Teléfono'},
    {id: 'email', title: 'Email'}, // Placeholder
    {id: 'types', title: 'Rubros'}
  ]
});

async function getPlaces(nextPageToken = '') {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
  const response = await axios.get(url);
  return response.data;
}

async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,international_phone_number,types&key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data.result;
}

(async () => {
  let results = [];
  let data = await getPlaces();

  for (const place of data.results) {
    const details = await getPlaceDetails(place.place_id);
    results.push({
      place_id: place.place_id,
      name: details.name,
      address: details.formatted_address,
      phone: details.international_phone_number || '',
      email: '', // No se obtiene desde Places
      types: details.types.join(', ')
    });
  }

  await csvWriter.writeRecords(results);
  console.log('Datos guardados en places.csv');
})();
