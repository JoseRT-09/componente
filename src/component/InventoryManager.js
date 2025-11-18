import { IProvidedInterface } from './interfaces/IProvidedInterface.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { ItemStatistics, CategoryBreakdown } from '../models/ItemStatistics.js';
import { ComponentNotInitializedException } from '../exceptions/ComponentNotInitializedException.js';
import { ItemAlreadyExistsException } from '../exceptions/ItemAlreadyExistsException.js';
import { ItemNotFoundException } from '../exceptions/ItemNotFoundException.js';

export class InventoryManager extends IProvidedInterface {
    constructor(storageProvider) {
        super();
        this.storageProvider = storageProvider;
        this.inventory = new Map();
        this.initialized = false;
        console.log('[InventoryManager] Componente creado');
    }

    async initialize() {
        if (this.initialized) {
            throw new Error('El componente ya está inicializado');
        }

        console.log('[InventoryManager] Inicializando...');

        try {
            const data = await this.storageProvider.load();
            if (data && Object.keys(data).length > 0) {
                this._loadInventoryFromData(data);
            }
            this.initialized = true;
            console.log(`[InventoryManager] Inicializado con ${this.inventory.size} ítems`);
        } catch (error) {
            console.error('[InventoryManager] Error:', error.message);
            throw new Error(`Fallo en inicialización: ${error.message}`);
        }
    }

    async addItem(itemId, itemData) {
        this._ensureInitialized();

        if (this.inventory.has(itemId)) {
            throw new ItemAlreadyExistsException(itemId);
        }

        const item = new InventoryItem({
            id: itemId,
            name: itemData.name,
            quantity: itemData.quantity,
            price: itemData.price,
            category: itemData.category,
            description: itemData.description
        });

        const validation = item.validate();
        if (!validation.isValid) {
            throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
        }

        this.inventory.set(itemId, item);
        await this._persistInventory();

        console.log(`[InventoryManager] Ítem agregado: ${itemId}`);
        return item.clone();
    }

    async updateQuantity(itemId, quantity) {
        this._ensureInitialized();

        const item = this.inventory.get(itemId);
        if (!item) {
            throw new ItemNotFoundException(itemId);
        }

        if (quantity < 0) {
            throw new Error('La cantidad no puede ser negativa');
        }

        item.quantity = quantity;
        item.updatedAt = new Date();
        await this._persistInventory();

        console.log(`[InventoryManager] Cantidad actualizada: ${itemId} = ${quantity}`);
        return item.clone();
    }

    getItem(itemId) {
        this._ensureInitialized();
        const item = this.inventory.get(itemId);
        return item ? item.clone() : null;
    }

    listAll() {
        this._ensureInitialized();
        return Array.from(this.inventory.values()).map(item => item.clone());
    }

    filterByCategory(category) {
        this._ensureInitialized();
        return Array.from(this.inventory.values())
            .filter(item => item.category === category)
            .map(item => item.clone());
    }

    async removeItem(itemId) {
        this._ensureInitialized();

        const item = this.inventory.get(itemId);
        if (!item) {
            throw new ItemNotFoundException(itemId);
        }

        this.inventory.delete(itemId);
        await this._persistInventory();

        console.log(`[InventoryManager] Ítem eliminado: ${itemId}`);
        return item.clone();
    }

    getStatistics() {
        this._ensureInitialized();

        const items = Array.from(this.inventory.values());
        const stats = new ItemStatistics();

        stats.totalItems = items.length;
        stats.totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        stats.totalValue = items.reduce((sum, item) => sum + item.getTotalValue(), 0);

        const byCategory = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        stats.categoriesCount = Object.keys(byCategory).length;
        stats.categoryBreakdown = Object.entries(byCategory).map(([category, categoryItems]) => {
            return new CategoryBreakdown(
                category,
                categoryItems.length,
                categoryItems.reduce((sum, item) => sum + item.quantity, 0),
                categoryItems.reduce((sum, item) => sum + item.getTotalValue(), 0)
            );
        });

        return stats;
    }

    isInitialized() {
        return this.initialized;
    }

    _ensureInitialized() {
        if (!this.initialized) {
            throw new ComponentNotInitializedException();
        }
    }

    async _persistInventory() {
        const data = {};
        this.inventory.forEach((item, key) => {
            data[key] = item.toJSON();
        });
        await this.storageProvider.save(data);
    }

    _loadInventoryFromData(data) {
        Object.entries(data).forEach(([key, value]) => {
            const item = new InventoryItem(value);
            if (value.createdAt) item.createdAt = new Date(value.createdAt);
            if (value.updatedAt) item.updatedAt = new Date(value.updatedAt);
            this.inventory.set(key, item);
        });
    }
}