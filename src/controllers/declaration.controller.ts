import { Request, Response, NextFunction } from 'express';
import { DeclarationService } from '../services/declaration.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class DeclarationController {
  static async getAllDeclarations(req: Request, res: Response, next: NextFunction) {
    try {
      const declarations = await DeclarationService.getAllDeclarations();
      res.json(declarations);
    } catch (error) {
      next(error);
    }
  }

  static async getDeclarationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const declaration = await DeclarationService.getDeclarationById(Number(id));

      if (!declaration) {
        res.status(404).json({ message: ERROR_MESSAGES.DECLARATION_NOT_FOUND });
        return;
      }

      res.json(declaration);
    } catch (error) {
      next(error);
    }
  }

  static async createDeclaration(req: Request, res: Response, next: NextFunction) {
    try {
      const newDeclaration = await DeclarationService.createDeclaration(req.body);
      res.status(201).json(newDeclaration);
    } catch (error) {
      next(error);
    }
  }

  static async updateDeclaration(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedDeclaration = await DeclarationService.updateDeclaration(Number(id), req.body);

      if (!updatedDeclaration) {
        res.status(404).json({ message: ERROR_MESSAGES.DECLARATION_NOT_FOUND });
        return;
      }

      res.json(updatedDeclaration);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDeclaration(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await DeclarationService.deleteDeclaration(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.DECLARATION_NOT_FOUND });
        return;
      }

      res.json({ message: 'Declaración eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
