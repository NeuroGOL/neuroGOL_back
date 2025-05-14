import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class RoleController {
  static async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }

  static async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(Number(id));

      if (!role) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json(role);
    } catch (error) {
      next(error);
    }
  }

  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const newRole = await RoleService.createRole(req.body);
      res.status(201).json(newRole);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedRole = await RoleService.updateRole(Number(id), req.body);

      if (!updatedRole) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json(updatedRole);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await RoleService.deleteRole(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
