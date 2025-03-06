import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.post(
  '/register',
  [
    body('nombre').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
    body('email').isEmail().withMessage(ERROR_MESSAGES.INVALID_EMAIL),
    body('contrasena').isLength({ min: 6 }).withMessage(ERROR_MESSAGES.PASSWORD_TOO_SHORT),
    body('role_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ROLE),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage(ERROR_MESSAGES.INVALID_EMAIL),
    body('contrasena').isString().withMessage(ERROR_MESSAGES.PASSWORD_TOO_SHORT),
    validateRequest
  ],
  AuthController.login
);

export default router;
