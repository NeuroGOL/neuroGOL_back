import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express'; // Importamos la interfaz personalizada

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ahora TypeScript reconoce `req.user`
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};
