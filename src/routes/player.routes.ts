import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/', PlayerController.getAllPlayers);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, PlayerController.getPlayerById);

router.post(
    '/',
    [
        body('nombre').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
        body('equipo').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
        body('fecha_nacimiento').isISO8601().withMessage('Debe ser una fecha válida (YYYY-MM-DD)'),
        body('nacionalidad').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
        body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
        validateRequest
    ],
    PlayerController.createPlayer
);

router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

export default router;
