import { Router } from 'express';
import { body, param } from 'express-validator';
import { PlayerController } from '../controllers/player.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', PlayerController.getAllPlayers);

router.get(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  PlayerController.getPlayerById
);

router.post(
  '/',
  [
    body('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('equipo').isString().isLength({ min: 3 }).withMessage('El equipo debe tener al menos 3 caracteres'),
    body('fecha_nacimiento').isISO8601().toDate().withMessage('Fecha inválida'),
    body('nacionalidad').isString().isLength({ min: 3 }).withMessage('La nacionalidad debe tener al menos 3 caracteres'),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest
  ],
  PlayerController.createPlayer
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('equipo').optional().isString().isLength({ min: 3 }).withMessage('El equipo debe tener al menos 3 caracteres'),
    body('fecha_nacimiento').optional().isISO8601().toDate().withMessage('Fecha inválida'),
    body('nacionalidad').optional().isString().isLength({ min: 3 }).withMessage('La nacionalidad debe tener al menos 3 caracteres'),
    body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest
  ],
  PlayerController.updatePlayer
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  PlayerController.deletePlayer
);

export default router;
