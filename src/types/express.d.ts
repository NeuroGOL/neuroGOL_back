import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any; // Puedes definir una interfaz más específica si lo deseas
}
