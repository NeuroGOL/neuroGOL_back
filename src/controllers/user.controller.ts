import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));

      if (!user) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(Number(id), req.body);

      if (!updatedUser) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
