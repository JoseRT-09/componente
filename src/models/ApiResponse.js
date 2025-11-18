export class ApiResponse {
    constructor(success, message, data = null) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = new Date();
    }

    static success(data, message = 'Operación exitosa') {
        return new ApiResponse(true, message, data);
    }

    static error(message) {
        return new ApiResponse(false, message, null);
    }

    toJSON() {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp
        };
    }
}