import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role_id').isInt().withMessage('Debe proporcionar un rol válido'),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest 
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').isString().withMessage('Debe ingresar una contraseña'),
    validateRequest
  ],
  AuthController.login
);

export default router;
