import { Request, Response } from 'express';
import { PlayerService } from '../services/player.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class PlayerController {
  static async getAllPlayers(req: Request, res: Response): Promise<void> {
    try {
      const players = await PlayerService.getAllPlayers();
      res.json(players);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_PLAYERS_ERROR });
    }
  }

  static async getPlayerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const player = await PlayerService.getPlayerById(Number(id));

      if (!player) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json(player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_PLAYERS_ERROR });
    }
  }

  static async createPlayer(req: Request, res: Response): Promise<void> {
    try {
      const newPlayer = await PlayerService.createPlayer(req.body);
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_PLAYER_ERROR });
    }
  }

  static async updatePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedPlayer = await PlayerService.updatePlayer(Number(id), req.body);

      if (!updatedPlayer) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json(updatedPlayer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.UPDATE_PLAYER_ERROR });
    }
  }

  static async deletePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await PlayerService.deletePlayer(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.PLAYER_NOT_FOUND });
        return;
      }

      res.json({ message: 'Jugador eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_PLAYER_ERROR });
    }
  }
}
