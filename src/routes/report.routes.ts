import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { validateRequest } from '../middleware/validateRequest';
import { param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/player/:player_id', param('player_id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, ReportController.getReportsByPlayer);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, ReportController.getReportById);

router.post('/', ReportController.createReport);
router.delete('/:id', ReportController.deleteReport);

// Generar reporte automático de emociones
router.post('/generate/:player_id', ReportController.generateEmotionReport);

export default router;
