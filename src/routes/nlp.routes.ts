import { Router } from 'express';
import { NLPController } from '../controllers/nlp.controller';

const router = Router();

// Ruta para obtener análisis por jugador (ID)
router.get('/player/:player_id', NLPController.getAnalysisByPlayer);

// Ruta para crear un análisis de texto
router.post('/analyze', NLPController.createAnalysis);

// Ruta para eliminar un análisis por ID
router.delete('/:id', NLPController.deleteAnalysis);

export default router;
