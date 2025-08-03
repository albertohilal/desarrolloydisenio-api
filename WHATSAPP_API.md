# WhatsApp Campaign API Documentation

## Overview

This API provides endpoints for managing WhatsApp marketing campaigns and message sends. It allows you to create campaigns, manage target contacts, and track message delivery status.

## Database Tables

### ll_campanias_whatsapp
- `id` (int) - Primary key
- `nombre` (varchar) - Campaign name
- `mensaje` (text) - Campaign message template
- `fecha_creacion` (datetime) - Creation timestamp
- `estado` (enum) - Campaign status: 'pendiente', 'en_progreso', 'finalizado'

### ll_envios_whatsapp
- `id` (int) - Primary key
- `campania_id` (int) - Foreign key to campaign
- `telefono_wapp` (varchar) - WhatsApp phone number
- `nombre_destino` (varchar) - Recipient name
- `mensaje_final` (text) - Final personalized message
- `estado` (enum) - Send status: 'pendiente', 'enviado', 'error'
- `fecha_envio` (datetime) - Send timestamp
- `lugar_id` (int) - Optional foreign key to ll_lugares

### ll_lugares (Updated)
Added WhatsApp-related fields:
- `telefono_wapp` (varchar) - WhatsApp phone number
- `wapp_valido` (tinyint) - Whether WhatsApp number is validated
- `rating` (decimal) - Place rating
- `reviews` (int) - Number of reviews
- `tipos` (text) - Place types
- `precio` (tinyint) - Price level
- `abierto` (tinyint) - Whether place is open

## API Endpoints

### Campaign Management

#### GET /api/whatsapp/campanias
Get all campaigns with statistics.

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Campaign Name",
    "mensaje": "Campaign message template",
    "fecha_creacion": "2024-12-08T10:00:00.000Z",
    "estado": "pendiente",
    "total_envios": 150,
    "enviados": 120,
    "errores": 5
  }
]
```

#### GET /api/whatsapp/campanias/:id
Get specific campaign details.

#### POST /api/whatsapp/campanias
Create a new campaign.

**Request Body:**
```json
{
  "nombre": "Campaign Name",
  "mensaje": "Hello {{nombre}}, this is our campaign message!"
}
```

#### PUT /api/whatsapp/campanias/:id
Update campaign details.

**Request Body:**
```json
{
  "nombre": "Updated Campaign Name",
  "mensaje": "Updated message",
  "estado": "en_progreso"
}
```

#### DELETE /api/whatsapp/campanias/:id
Delete a campaign (cascades to all sends).

### Message Send Management

#### GET /api/whatsapp/campanias/:id/envios
Get all sends for a campaign.

**Query Parameters:**
- `estado` (optional) - Filter by send status
- `limit` (optional) - Limit number of results
- `offset` (optional) - Offset for pagination

**Response:**
```json
[
  {
    "id": 1,
    "campania_id": 1,
    "telefono_wapp": "+5491123456789",
    "nombre_destino": "John Doe",
    "mensaje_final": "Hello John Doe, this is our campaign message!",
    "estado": "enviado",
    "fecha_envio": "2024-12-08T11:30:00.000Z",
    "lugar_id": 123,
    "lugar_nombre": "Restaurant ABC",
    "lugar_direccion": "Main St 123"
  }
]
```

#### POST /api/whatsapp/campanias/:id/envios
Create a new individual send.

**Request Body:**
```json
{
  "telefono_wapp": "+5491123456789",
  "nombre_destino": "John Doe",
  "mensaje_final": "Personalized message",
  "lugar_id": 123
}
```

#### POST /api/whatsapp/campanias/:id/envios/bulk
Bulk create sends from existing places with WhatsApp numbers.

**Request Body:**
```json
{
  "filtros": {
    "rubro_id": 75,
    "zona_id": 1,
    "wapp_valido": 1
  }
}
```

**Response:**
```json
{
  "message": "150 envíos creados exitosamente",
  "count": 150
}
```

#### PUT /api/whatsapp/campanias/envios/:envioId
Update send status.

**Request Body:**
```json
{
  "estado": "enviado",
  "fecha_envio": "2024-12-08T11:30:00.000Z"
}
```

## Usage Examples

### Creating a Restaurant Campaign
```javascript
// 1. Create campaign
const campaign = await fetch('/api/whatsapp/campanias', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Promoción Restaurantes Diciembre',
    mensaje: 'Hola {{nombre}}! 🍽️ Tenemos promociones especiales este mes en nuestro restaurante. ¡Te esperamos!'
  })
});

// 2. Bulk create sends for restaurants
const bulkSends = await fetch(`/api/whatsapp/campanias/${campaign.id}/envios/bulk`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filtros: {
      rubro_id: 75, // Restaurant category
      wapp_valido: 1 // Only validated WhatsApp numbers
    }
  })
});

// 3. Update campaign status
await fetch(`/api/whatsapp/campanias/${campaign.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    estado: 'en_progreso'
  })
});
```

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `409` - Conflict (duplicate send for same phone/campaign)
- `500` - Internal Server Error

Error responses include a message:
```json
{
  "error": "Error description"
}
```

## Migration

To set up the database tables, run the migration script:
```bash
node test-whatsapp-migration.js
```

This will create all necessary tables and fields if they don't exist.