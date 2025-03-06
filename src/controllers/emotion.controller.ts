import { Request, Response } from 'express';
import { EmotionService } from '../services/emotion.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class EmotionController {
  static async getEmotionsByPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const emotions = await EmotionService.getEmotionsByPlayer(Number(player_id));
      res.json(emotions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_EMOTIONS_ERROR });
    }
  }

  static async getEmotionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const emotion = await EmotionService.getEmotionById(Number(id));

      if (!emotion) {
        res.status(404).json({ message: ERROR_MESSAGES.EMOTION_NOT_FOUND });
        return;
      }

      res.json(emotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_EMOTIONS_ERROR });
    }
  }

  static async createEmotion(req: Request, res: Response): Promise<void> {
    try {
      const newEmotion = await EmotionService.createEmotion(req.body);
      res.status(201).json(newEmotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_EMOTION_ERROR });
    }
  }

  static async deleteEmotion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await EmotionService.deleteEmotion(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.EMOTION_NOT_FOUND });
        return;
      }

      res.json({ message: 'Emoción eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_EMOTION_ERROR });
    }
  }
}
