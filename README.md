# Componente de Gestión de Inventario - CBSE

## Descripción
Componente basado en principios de Component-Based Software Engineering (CBSE).

## Instalación
```bash
npm install
```

## Ejecución
```bash
# Modo normal
npm start

# Modo desarrollo (auto-reload)
npm run dev

# Con almacenamiento en archivo
STORAGE_TYPE=file npm start
```

## Endpoints
- `GET /api/inventory/` - Información
- `POST /api/inventory/items` - Agregar ítem
- `GET /api/inventory/items` - Listar todos
- `GET /api/inventory/items/:id` - Obtener por ID
- `PUT /api/inventory/items/:id/quantity` - Actualizar cantidad
- `DELETE /api/inventory/items/:id` - Eliminar
- `GET /api/inventory/categories/:category` - Filtrar
- `GET /api/inventory/statistics` - Estadísticas

## Ejemplo
```bash
curl http://localhost:8080/api/inventory/
```