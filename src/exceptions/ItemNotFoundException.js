export class ItemNotFoundException extends Error {
    constructor(itemId) {
        super(`El ítem con ID '${itemId}' no fue encontrado`);
        this.name = 'ItemNotFoundException';
        this.itemId = itemId;
    }
}