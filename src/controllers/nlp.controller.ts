import { Request, Response } from 'express';
import { NLPService } from '../services/nlp.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class NLPController {
  static async getAnalysisByPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const analysis = await NLPService.getAnalysisByPlayer(Number(player_id));
      res.json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_NLP_ERROR });
    }
  }

  static async getAnalysisById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const analysis = await NLPService.getAnalysisById(Number(id));

      if (!analysis) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_NOT_FOUND });
        return;
      }

      res.json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_NLP_ERROR });
    }
  }

  static async analyzeText(req: Request, res: Response): Promise<void> {
    try {
      const { player_id, fuente, texto } = req.body;

      if (!player_id || !fuente || !texto) {
        res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
        return;
      }

      const analysis = await NLPService.analyzeText(player_id, fuente, texto);
      res.status(201).json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_NLP_ERROR });
    }
  }

  static async deleteAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await NLPService.deleteAnalysis(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_NOT_FOUND });
        return;
      }

      res.json({ message: 'Análisis eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_NLP_ERROR });
    }
  }
}
