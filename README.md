# desarrolloydisenio-api

Este proyecto permite automatizar la consulta de datos comerciales mediante la API de Google Places.

## 🎯 Funcionalidades

- Consulta automatizada por rubros comerciales
- Búsqueda específica de tatuadores en Lomas de Zamora
- Extracción de nombre, dirección, teléfono, web, email y place_id
- Almacenamiento de resultados en base de datos MySQL
- Visualización en mapa interactivo con Leaflet
- Sistema de grillas para búsquedas exhaustivas
- Calculadora de costos de API

## 🛠️ Tecnologías

- Node.js + Express
- Google Places API
- MySQL
- Leaflet (mapas)
- Axios, dotenv

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crear archivo `.env` con:

```env
GOOGLE_API_KEY=tu_api_key
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_base_datos
```

## 🚀 Uso

### Iniciar servidor
```bash
npm start
```

Luego acceder a:
- **Mapa de tatuadores**: http://localhost:3000/mapa_tatuadores.html
- **Mapa de grilla**: http://localhost:3000/grilla_mapa.html

### Buscar tatuadores
```bash
node scripts/busqueda/buscar_tatuadores.js
```

### Calcular costos
```bash
node scripts/utilidades/calcular_costo_busqueda.js
```

### Ver datos
```bash
node scripts/utilidades/ver_zonas.js
node scripts/utilidades/ver_rubros.js
```

## 📁 Estructura del proyecto

```
├── public/              # Archivos HTML estáticos
│   ├── mapa_tatuadores.html
│   └── grilla_mapa.html
├── routes/              # Rutas de la API
│   ├── lugares.js       # API de tatuadores
│   ├── rubros.js        # API de rubros
│   └── grillas.js       # API de grillas
├── scripts/
│   ├── busqueda/        # Scripts de búsqueda
│   │   ├── buscar_tatuadores.js
│   │   └── buscar_desde_rubros.js
│   └── utilidades/      # Scripts de utilidad
│       ├── ver_zonas.js
│       └── calcular_costo_busqueda.js
├── index.js             # Servidor Express
└── db.js                # Conexión a base de datos
```

## 🎨 Resultados

- **2,700 tatuadores** encontrados en Lomas de Zamora
- **9 zonas** de búsqueda activas
- **5 keywords** de tatuajes utilizadas
- Costo estimado: ~$20 USD en API de Google

