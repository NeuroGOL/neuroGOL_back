import { Router } from 'express';
import { body, param } from 'express-validator';
import { DeclarationController } from '../controllers/declaration.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', DeclarationController.getAllDeclarations);

router.get(
  '/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validateRequest,
  DeclarationController.getDeclarationById
);

router.post(
  '/',
  [
    body('player_id').isInt().withMessage('El ID del jugador debe ser un número entero'),
    body('user_id').isInt().withMessage('El ID del usuario debe ser un número entero'),
    body('categoria_texto').isString().isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
    body('fuente').isString().isLength({ min: 3 }).withMessage('La fuente debe tener al menos 3 caracteres'),
    body('texto').isString().isLength({ min: 5 }).withMessage('El texto debe tener al menos 5 caracteres'),
    validateRequest
  ],
  DeclarationController.createDeclaration
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('categoria_texto').optional().isString().isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
    body('fuente').optional().isString().isLength({ min: 3 }).withMessage('La fuente debe tener al menos 3 caracteres'),
    body('texto').optional().isString().isLength({ min: 5 }).withMessage('El texto debe tener al menos 5 caracteres'),
    validateRequest
  ],
  DeclarationController.updateDeclaration
);

router.delete(
  '/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validateRequest,
  DeclarationController.deleteDeclaration
);

export default router;
