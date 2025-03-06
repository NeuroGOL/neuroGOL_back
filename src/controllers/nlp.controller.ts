import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { NLPService } from '../services/nlp.service';

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

    // Validación de campos
    if (!player_id || !fuente || !texto) {
      res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
      return; // No necesitas usar Promise.resolve(), Express maneja la respuesta
    }

    try {
      // Llamamos al servicio NLPService para analizar el texto
      const analysis = await NLPService.analyzeText(player_id, fuente, texto);

      // En este caso, asumimos que `analyzeText` devuelve el análisis completado
      res.status(201).json({
        message: 'Análisis creado correctamente',
        analysis: analysis, // Devolvemos los datos del análisis
      });
    } catch (error) {
      console.error(error);
      next(error);  // Delega al manejador de errores global
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
