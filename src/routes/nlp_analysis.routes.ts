import { Router } from 'express';
import { body, param } from 'express-validator';
import { NLPAnalysisController } from '../controllers/nlp_analysis.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', NLPAnalysisController.getAllNLPAnalysis);

router.get(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  NLPAnalysisController.getNLPAnalysisById
);

router.post(
  '/',
  [
    body('declaration_id').isInt().withMessage('El ID de la declaración debe ser un número entero'),
    validateRequest
  ],
  NLPAnalysisController.createNLPAnalysis
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('El ID debe ser un número entero')],
  validateRequest,
  NLPAnalysisController.deleteNLPAnalysis
);

export default router;
