export class InventoryItem {
    constructor({ id, name, quantity, price, category = 'sin_categoria', description = '' }) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.description = description;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    getTotalValue() {
        return this.quantity * this.price;
    }

    validate() {
        const errors = [];

        if (!this.id || this.id.trim() === '') {
            errors.push('El ID es requerido');
        }
        if (!this.name || this.name.trim() === '') {
            errors.push('El nombre es requerido');
        }
        if (this.quantity === undefined || this.quantity === null) {
            errors.push('La cantidad es requerida');
        }
        if (this.quantity < 0) {
            errors.push('La cantidad no puede ser negativa');
        }
        if (this.price === undefined || this.price === null) {
            errors.push('El precio es requerido');
        }
        if (this.price < 0) {
            errors.push('El precio no puede ser negativo');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price,
            category: this.category,
            description: this.description,
            totalValue: this.getTotalValue(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    clone() {
        const cloned = new InventoryItem({
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price,
            category: this.category,
            description: this.description
        });
        cloned.createdAt = this.createdAt;
        cloned.updatedAt = this.updatedAt;
        return cloned;
    }
}