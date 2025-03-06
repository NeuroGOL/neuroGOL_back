import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class RoleController {
  static async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_ROLES_ERROR });
    }
  }

  static async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(Number(id));

      if (!role) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json(role);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_ROLES_ERROR });
    }
  }

  static async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
        return;
      }

      const newRole = await RoleService.createRole(nombre);
      res.status(201).json(newRole);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_ROLE_ERROR });
    }
  }

  static async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      if (!nombre) {
        res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
        return;
      }

      const updatedRole = await RoleService.updateRole(Number(id), nombre);

      if (!updatedRole) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json(updatedRole);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.UPDATE_ROLE_ERROR });
    }
  }

  static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await RoleService.deleteRole(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
        return;
      }

      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_ROLE_ERROR });
    }
  }
}
