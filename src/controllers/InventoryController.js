import { ApiResponse } from '../models/ApiResponse.js';
import { ComponentNotInitializedException } from '../exceptions/ComponentNotInitializedException.js';
import { ItemAlreadyExistsException } from '../exceptions/ItemAlreadyExistsException.js';
import { ItemNotFoundException } from '../exceptions/ItemNotFoundException.js';

export class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }

    async welcome(req, res) {
        const info = {
            component: 'Inventory Manager CBSE',
            version: '1.0.0',
            status: this.inventoryService.isInitialized() ? 'initialized' : 'not initialized',
            endpoints: [
                'POST   /api/inventory/items',
                'GET    /api/inventory/items',
                'GET    /api/inventory/items/:id',
                'PUT    /api/inventory/items/:id/quantity',
                'DELETE /api/inventory/items/:id',
                'GET    /api/inventory/categories/:category',
                'GET    /api/inventory/statistics'
            ]
        };

        res.json(ApiResponse.success(info, 'Componente operativo'));
    }

    async addItem(req, res) {
        try {
            const item = await this.inventoryService.addItem(req.body.id, req.body);
            res.status(201).json(ApiResponse.success(item, 'Ítem agregado exitosamente'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async listAll(req, res) {
        try {
            const items = this.inventoryService.listAll();
            res.json(ApiResponse.success(items, 'Lista recuperada'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async getItem(req, res) {
        try {
            const item = this.inventoryService.getItem(req.params.id);
            if (!item) {
                return res.status(404).json(ApiResponse.error('Ítem no encontrado'));
            }
            res.json(ApiResponse.success(item));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async updateQuantity(req, res) {
        try {
            const { quantity } = req.body;
            if (quantity === undefined || quantity === null) {
                return res.status(400).json(ApiResponse.error("Campo 'quantity' requerido"));
            }

            const item = await this.inventoryService.updateQuantity(req.params.id, quantity);
            res.json(ApiResponse.success(item, 'Cantidad actualizada'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async removeItem(req, res) {
        try {
            const item = await this.inventoryService.removeItem(req.params.id);
            res.json(ApiResponse.success(item, 'Ítem eliminado'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async filterByCategory(req, res) {
        try {
            const items = this.inventoryService.filterByCategory(req.params.category);
            res.json(ApiResponse.success(items, 'Filtrado por categoría'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async getStatistics(req, res) {
        try {
            const stats = this.inventoryService.getStatistics();
            res.json(ApiResponse.success(stats, 'Estadísticas calculadas'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    async getStatus(req, res) {
        try {
            const status = {
                initialized: this.inventoryService.isInitialized(),
                totalItems: this.inventoryService.listAll().length,
                component: 'InventoryManager'
            };
            res.json(ApiResponse.success(status, 'Estado del componente'));
        } catch (error) {
            this._handleError(error, res);
        }
    }

    _handleError(error, res) {
        console.error('Error:', error.message);

        if (error instanceof ComponentNotInitializedException) {
            return res.status(503).json(ApiResponse.error(error.message));
        }
        if (error instanceof ItemAlreadyExistsException) {
            return res.status(409).json(ApiResponse.error(error.message));
        }
        if (error instanceof ItemNotFoundException) {
            return res.status(404).json(ApiResponse.error(error.message));
        }
        if (error.message.includes('Validación fallida') || 
            error.message.includes('cantidad no puede ser negativa')) {
            return res.status(400).json(ApiResponse.error(error.message));
        }

        res.status(500).json(ApiResponse.error(`Error interno: ${error.message}`));
    }
}