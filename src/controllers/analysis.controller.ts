import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AnalysisController {
  static async getAllAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await AnalysisService.getAllAnalysis();
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalysisById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analysis = await AnalysisService.getAnalysisById(Number(id));

      if (!analysis) {
        res.status(404).json({ message: ERROR_MESSAGES.ANALYSIS_NOT_FOUND });
        return;
      }

      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async createAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const newAnalysis = await AnalysisService.createAnalysis(req.body);
      res.status(201).json(newAnalysis);
    } catch (error) {
      next(error);
    }
  }

  static async updateAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedAnalysis = await AnalysisService.updateAnalysis(Number(id), req.body);

      if (!updatedAnalysis) {
        res.status(404).json({ message: ERROR_MESSAGES.ANALYSIS_NOT_FOUND });
        return;
      }

      res.json(updatedAnalysis);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await AnalysisService.deleteAnalysis(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.ANALYSIS_NOT_FOUND });
        return;
      }

      res.json({ message: 'Análisis eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
