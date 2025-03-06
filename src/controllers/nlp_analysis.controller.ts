import { Request, Response, NextFunction } from 'express';
import { NLPAnalysisService } from '../services/nlp_analysis.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class NLPAnalysisController {
  static async getAllNLPAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await NLPAnalysisService.getAllNLPAnalysis();
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async getNLPAnalysisById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analysis = await NLPAnalysisService.getNLPAnalysisById(Number(id));

      if (!analysis) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_ANALYSIS_NOT_FOUND });
        return;
      }

      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async createNLPAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { analysis_id, texto } = req.body;
      const newAnalysis = await NLPAnalysisService.createNLPAnalysis(analysis_id);
      res.status(201).json(newAnalysis);
    } catch (error) {
      next(error);
    }
  }

  static async deleteNLPAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await NLPAnalysisService.deleteNLPAnalysis(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.NLP_ANALYSIS_NOT_FOUND });
        return;
      }

      res.json({ message: 'Análisis NLP eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
