import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_USERS_ERROR });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));

      if (!user) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_USERS_ERROR });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_USER_ERROR });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(Number(id), req.body);

      if (!updatedUser) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.UPDATE_USER_ERROR });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_USER_ERROR });
    }
  }
}
