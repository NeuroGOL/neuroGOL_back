import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err); // 🔹 Para debugging

    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({ error: message });
};
