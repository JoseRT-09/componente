import { IRequiredInterface } from '../component/interfaces/IRequiredInterface.js';

export class InMemoryStorageProvider extends IRequiredInterface {
    constructor() {
        super();
        this.storage = new Map();
        console.log('[InMemoryStorage] Proveedor creado');
    }

    load() {
        console.log('[InMemoryStorage] Cargando datos');
        const data = {};
        this.storage.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    save(data) {
        console.log(`[InMemoryStorage] Guardando ${Object.keys(data).length} ítems`);
        this.storage.clear();
        Object.entries(data).forEach(([key, value]) => {
            this.storage.set(key, value);
        });
    }

    isAvailable() {
        return true;
    }
}