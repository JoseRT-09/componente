export class InventoryService {
    constructor(inventoryManager) {
        this.inventoryManager = inventoryManager;
    }

    async initialize() {
        if (!this.inventoryManager.isInitialized()) {
            await this.inventoryManager.initialize();
        }
    }

    async addItem(itemId, item) {
        return await this.inventoryManager.addItem(itemId, item);
    }

    async updateQuantity(itemId, quantity) {
        return await this.inventoryManager.updateQuantity(itemId, quantity);
    }

    getItem(itemId) {
        return this.inventoryManager.getItem(itemId);
    }

    listAll() {
        return this.inventoryManager.listAll();
    }

    filterByCategory(category) {
        return this.inventoryManager.filterByCategory(category);
    }

    async removeItem(itemId) {
        return await this.inventoryManager.removeItem(itemId);
    }

    getStatistics() {
        return this.inventoryManager.getStatistics();
    }

    isInitialized() {
        return this.inventoryManager.isInitialized();
    }
}