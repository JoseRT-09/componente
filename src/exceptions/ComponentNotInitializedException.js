export class ComponentNotInitializedException extends Error {
    constructor(message = 'El componente no ha sido inicializado. Llame a initialize() primero.') {
        super(message);
        this.name = 'ComponentNotInitializedException';
    }
}