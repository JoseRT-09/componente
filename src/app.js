import express from 'express';
import { InventoryManager } from './component/InventoryManager.js';
import { InMemoryStorageProvider } from './adapters/InMemoryStorageProvider.js';
import { FileStorageProvider } from './adapters/FileStorageProvider.js';
import { InventoryService } from './services/InventoryService.js';
import { InventoryController } from './controllers/InventoryController.js';

const PORT = process.env.PORT || 8080;
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'memory';

const app = express();
app.use(express.json());

const storageProvider = STORAGE_TYPE === 'file'
    ? new FileStorageProvider('inventory-data.json')
    : new InMemoryStorageProvider();

const inventoryManager = new InventoryManager(storageProvider);
const inventoryService = new InventoryService(inventoryManager);
const controller = new InventoryController(inventoryService);

await inventoryService.initialize();

app.get('/api/inventory/', (req, res) => controller.welcome(req, res));
app.post('/api/inventory/items', (req, res) => controller.addItem(req, res));
app.get('/api/inventory/items', (req, res) => controller.listAll(req, res));
app.get('/api/inventory/items/:id', (req, res) => controller.getItem(req, res));
app.put('/api/inventory/items/:id/quantity', (req, res) => controller.updateQuantity(req, res));
app.delete('/api/inventory/items/:id', (req, res) => controller.removeItem(req, res));
app.get('/api/inventory/categories/:category', (req, res) => controller.filterByCategory(req, res));
app.get('/api/inventory/statistics', (req, res) => controller.getStatistics(req, res));
app.get('/api/inventory/status', (req, res) => controller.getStatus(req, res));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        hint: 'Visita /api/inventory/ para ver endpoints disponibles'
    });
});

app.listen(PORT, () => {
    console.log(`   Puerto: ${PORT}`);
    console.log(`   Storage: ${STORAGE_TYPE}`);
    console.log(`   URL: http://localhost:${PORT}/api/inventory/`);
});