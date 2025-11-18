import fs from 'fs/promises';
import { IRequiredInterface } from '../component/interfaces/IRequiredInterface.js';

export class FileStorageProvider extends IRequiredInterface {
    constructor(filePath = 'inventory-data.json') {
        super();
        this.filePath = filePath;
        this.available = true;
        console.log(`[FileStorage] Proveedor creado: ${filePath}`);
    }

    async load() {
        console.log(`[FileStorage] Cargando desde ${this.filePath}`);
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('[FileStorage] Archivo no existe');
                return {};
            }
            console.error('[FileStorage] Error:', error.message);
            this.available = false;
            return {};
        }
    }

    async save(data) {
        console.log(`[FileStorage] Guardando ${Object.keys(data).length} ítems`);
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('[FileStorage] Error:', error.message);
            this.available = false;
        }
    }

    isAvailable() {
        return this.available;
    }
}