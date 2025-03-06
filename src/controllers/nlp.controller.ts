import { Request, Response, NextFunction } from 'express';
import { NLPService } from '../services/nlp.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class NLPController {
  // Endpoint para obtener todos los análisis de un jugador
  static async getAnalysisByPlayer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { player_id } = req.params;
      const analysis = await NLPService.getAnalysisByPlayer(Number(player_id));

      if (analysis.length === 0) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_NOT_FOUND });
        return;
      }

      res.status(200).json(analysis);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // Endpoint para crear un análisis
  static async createAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { player_id, fuente, texto } = req.body;

    if (!player_id || !fuente || !texto) {
      res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
      return Promise.resolve();
    }

    try {
      const analysis = await NLPService.analyzeText(player_id, fuente, texto);
      res.status(201).json(analysis);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // Endpoint para eliminar un análisis por ID
  static async deleteAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
      const isDeleted = await NLPService.deleteAnalysis(Number(id));

      if (!isDeleted) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_NOT_FOUND });
        return;
      }

      res.status(200).json({ message: 'Análisis eliminado correctamente' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
