import { Router } from 'express';
import { NLPAnalysisController } from '../controllers/nlp_analysis.controller';

const router = Router();

router.get('/', NLPAnalysisController.getAllNLPAnalysis);
router.get('/:id', NLPAnalysisController.getNLPAnalysisById);
router.post('/', NLPAnalysisController.createNLPAnalysis);
router.delete('/:id', NLPAnalysisController.deleteNLPAnalysis);

export default router;
