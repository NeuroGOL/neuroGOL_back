import { Router } from 'express';
import { EmotionController } from '../controllers/emotion.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/player/:player_id', param('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, EmotionController.getEmotionsByPlayer);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, EmotionController.getEmotionById);

router.post(
    '/',
    [
        body('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID),
        body('tipo').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
        body('intensidad').isInt({ min: 1, max: 10 }).withMessage('La intensidad debe estar entre 1 y 10'),
        body('fecha').isISO8601().withMessage('Debe ser una fecha válida (YYYY-MM-DD)'),
        body('descripcion').optional().isString(),
        validateRequest
    ],
    EmotionController.createEmotion
);

router.delete('/:id', EmotionController.deleteEmotion);

export default router;
