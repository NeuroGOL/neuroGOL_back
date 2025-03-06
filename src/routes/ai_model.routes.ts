import { Router } from 'express';
import { AIModelController } from '../controllers/ai_model.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/player/:player_id', param('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, AIModelController.getPredictionsByPlayer);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, AIModelController.getPredictionById);

router.post('/', AIModelController.createPrediction);
router.delete('/:id', AIModelController.deletePrediction);

// Generar predicción automática
router.post('/predict/:player_id', AIModelController.predictEmotion);

export default router;
