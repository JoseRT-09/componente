export class ItemAlreadyExistsException extends Error {
    constructor(itemId) {
        super(`El ítem con ID '${itemId}' ya existe en el inventario`);
        this.name = 'ItemAlreadyExistsException';
        this.itemId = itemId;
    }
}