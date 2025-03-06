import { Request, Response, NextFunction } from 'express';
import { PlayerService } from '../services/player.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class PlayerController {
  static async getAllPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.json(players);
    } catch (error) {
      next(error);
    }
  }

  static async getPlayerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const player = await PlayerService.getPlayerById(Number(id));

      if (!player) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json(player);
    } catch (error) {
      next(error);
    }
  }

  static async createPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const newPlayer = await PlayerService.createPlayer(req.body);
      res.status(201).json(newPlayer);
    } catch (error) {
      next(error);
    }
  }

  static async updatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedPlayer = await PlayerService.updatePlayer(Number(id), req.body);

      if (!updatedPlayer) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json(updatedPlayer);
    } catch (error) {
      next(error);
    }
  }

  static async deletePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await PlayerService.deletePlayer(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json({ message: 'Jugador eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
