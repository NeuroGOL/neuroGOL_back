import { Request, Response } from 'express';
import { AIModelService } from '../services/ai_model.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AIModelController {
  static async getPredictionsByPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const predictions = await AIModelService.getPredictionsByPlayer(Number(player_id));
      res.json(predictions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_AI_MODELS_ERROR });
    }
  }

  static async getPredictionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const prediction = await AIModelService.getPredictionById(Number(id));

      if (!prediction) {
        res.status(404).json({ message: ERROR_MESSAGES.AI_MODEL_NOT_FOUND });
        return;
      }

      res.json(prediction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_AI_MODELS_ERROR });
    }
  }

  static async createPrediction(req: Request, res: Response): Promise<void> {
    try {
      const newPrediction = await AIModelService.createPrediction(req.body);
      res.status(201).json(newPrediction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_AI_MODEL_ERROR });
    }
  }

  static async deletePrediction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await AIModelService.deletePrediction(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.AI_MODEL_NOT_FOUND });
        return;
      }

      res.json({ message: 'Predicción eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_AI_MODEL_ERROR });
    }
  }

  static async predictEmotion(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const prediction = await AIModelService.predictEmotion(Number(player_id));

      res.status(201).json(prediction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_AI_MODEL_ERROR });
    }
  }
}
