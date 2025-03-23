// index.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

fetch('https://jsonplaceholder.typicode.com/users')
  .then(res => res.json())
  .then(data => {
    console.log("Usuarios de prueba:");
    data.forEach(user => {
      console.log(`${user.name} - ${user.email}`);
    });
  })
  .catch(err => console.error("Error:", err));
