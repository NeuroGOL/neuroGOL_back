import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = Router();

router.get('/', AnalysisController.getAllAnalysis);
router.get('/:id', AnalysisController.getAnalysisById);
router.post('/', AnalysisController.createAnalysis);
router.put('/:id', AnalysisController.updateAnalysis);
router.delete('/:id', AnalysisController.deleteAnalysis);

export default router;
