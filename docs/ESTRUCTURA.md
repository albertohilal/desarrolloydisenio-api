# Estructura del Proyecto - desarrolloydisenio-api

```
desarrolloydisenio-api/
│
├── 📄 index.js                          # Servidor Express principal
├── 📄 db.js                             # Configuración de conexión a MySQL
├── 📄 servidor.js                       # Servidor alternativo
├── 📄 package.json                      # Dependencias del proyecto
├── 📄 README.md                         # Documentación principal
├── 📄 .env                              # Variables de entorno (no versionado)
│
├── 📂 routes/                           # Rutas de la API REST
│   ├── lugares.js                       # API: /api/lugares (tatuadores)
│   ├── rubros.js                        # API: /api/rubros
│   ├── grillas.js                       # API: /api/grillas
│   └── busqueda.js                      # API: /api/busqueda
│
├── 📂 public/                           # Archivos estáticos web
│   ├── mapa_tatuadores.html            # 🎨 Mapa interactivo de tatuadores
│   ├── grilla_mapa.html                 # Mapa de grilla de búsqueda
│   ├── rubros.html                      # Gestión de rubros
│   ├── cuadriculas.html                 # Vista de cuadrículas
│   └── favicon.ico                      # Ícono del sitio
│
├── 📂 scripts/                          # Scripts de automatización
│   ├── 📂 busqueda/                     # Scripts de búsqueda en Google Places
│   │   ├── buscar_tatuadores.js        # 🔍 Buscar tatuadores (MAIN)
│   │   ├── buscar_desde_rubros.js      # Búsqueda por rubros
│   │   ├── buscar_texto.js             # Búsqueda por texto
│   │   └── completar_detalles.js       # Completar info de lugares
│   │
│   ├── 📂 utilidades/                   # Scripts de utilidad
│   │   ├── ver_zonas.js                # Ver zonas configuradas
│   │   ├── ver_rubros.js               # Ver rubros en BD
│   │   └── calcular_costo_busqueda.js  # Calcular costos de API
│   │
│   ├── generar_zonas.js                 # Generar zonas con geocoding
│   ├── generar_grilla_conurbano.js      # Generar grilla de búsqueda
│   ├── cargar_grilla_json_en_bd.js      # Importar grilla a BD
│   ├── exportar_grilla_json.js          # Exportar grilla de BD
│   ├── index-nearbysearch-detallado.js  # Búsqueda nearby completa
│   └── test-*.js                        # Tests diversos
│
├── 📂 docs/                             # Documentación
│   ├── tree.txt                         # Árbol de archivos completo
│   └── ESTRUCTURA.md                    # Este archivo
│
├── 📂 database/                         # Backups y scripts SQL
│   ├── ll_rubros.sql                    # Estructura tabla rubros
│   ├── ll_rubros_insert.sql             # Datos iniciales rubros
│   └── *.sql                            # Otros backups
│
├── 📂 rubros_backend/                   # Backend PHP (legacy)
│   ├── rubros.php                       # API PHP de rubros
│   ├── zonas.php                        # API PHP de zonas
│   └── *.html                           # Interfaces PHP
│
├── 📂 listados/                         # CSVs y datos de referencia
│   ├── keywords_google_traducidos.csv   # Keywords traducidas
│   ├── ll_rubros_populares.csv          # Rubros populares
│   └── places*.csv                      # Lugares exportados
│
├── 📂 logs/                             # Logs de ejecución
│   └── lugares-*.log                    # Logs de búsquedas
│
├── 📂 oauth/                            # Autenticación OAuth
│   └── callback/                        # Callbacks de OAuth
│
├── 📂 __archivados/                     # Archivos antiguos
└── 📂 Google Cloud/                     # Claves y tokens
```

## 🎯 Archivos Principales

### Scripts de Uso Frecuente

1. **Buscar tatuadores**
   ```bash
   node scripts/busqueda/buscar_tatuadores.js
   ```

2. **Ver datos**
   ```bash
   node scripts/utilidades/ver_zonas.js
   node scripts/utilidades/ver_rubros.js
   ```

3. **Calcular costos**
   ```bash
   node scripts/utilidades/calcular_costo_busqueda.js
   ```

### Servidor Web

```bash
npm start
# Acceder a: http://localhost:3000/mapa_tatuadores.html
```

## 📊 Estadísticas del Proyecto

- **Total archivos**: ~72 archivos
- **Líneas de código**: ~3,000+
- **APIs REST**: 4 rutas principales
- **Tatuadores encontrados**: 2,700
- **Zonas de búsqueda**: 9
- **Keywords utilizadas**: 5

## 🔧 Tecnologías

- Node.js + Express
- MySQL
- Google Places API
- Leaflet Maps
- PHP (legacy backend)
