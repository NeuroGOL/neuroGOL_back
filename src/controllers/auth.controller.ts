import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.register(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
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
