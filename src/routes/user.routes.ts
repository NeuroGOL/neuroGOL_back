import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', UserController.getAllUsers);

router.get(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  UserController.getUserById
);

router.post(
  '/',
  [
    body('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role_id').isInt().withMessage('Rol inválido'),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest
  ],
  UserController.createUser
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').optional().isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role_id').optional().isInt().withMessage('Rol inválido'),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest
  ],
  UserController.updateUser
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  UserController.deleteUser
);

export default router;
