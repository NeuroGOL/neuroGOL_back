import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const response = await AuthService.register(req.body);
      res.status(201).json(response);
    } catch (error: unknown) {
      console.error(error);
      
      // Forzar error como instancia de Error y obtener su mensaje
      const errorMessage = error instanceof Error ? error.message : 'REGISTRATION_ERROR';
      res.status(400).json({ message: ERROR_MESSAGES[errorMessage] || ERROR_MESSAGES.REGISTRATION_ERROR });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, contrasena } = req.body;
      const response = await AuthService.login(email, contrasena);
      res.json(response);
    } catch (error: unknown) {
      console.error(error);

      const errorMessage = error instanceof Error ? error.message : 'LOGIN_ERROR';
      res.status(400).json({ message: ERROR_MESSAGES[errorMessage] || ERROR_MESSAGES.LOGIN_ERROR });
    }
  }
}
