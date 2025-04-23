"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ApiError = ApiError;
const errorHandler = (err, req, res, next) => {
    console.error(err); // 🔹 Para debugging
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Error interno del servidor';
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
