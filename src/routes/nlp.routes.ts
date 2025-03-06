import { Router } from 'express';
import { NLPController } from '../controllers/nlp.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/player/:player_id', param('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, NLPController.getAnalysisByPlayer);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, NLPController.getAnalysisById);

router.post(
    '/',
    [
        body('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID),
        body('fuente').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.NAME_TOO_SHORT),
        body('texto').isString().isLength({ min: 10 }).withMessage('El texto debe tener al menos 10 caracteres'),
        validateRequest
    ],
    NLPController.analyzeText
);

router.delete('/:id', NLPController.deleteAnalysis);

export default router;
