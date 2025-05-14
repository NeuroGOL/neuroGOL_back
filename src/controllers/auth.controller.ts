import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
        const response = await AuthService.register(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error); // <-- Agrega esto
        res.status(400).json({ error: ERROR_MESSAGES.REGISTRATION_ERROR });
    }
}


  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, contrasena } = req.body;
      const response = await AuthService.login(email, contrasena);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
