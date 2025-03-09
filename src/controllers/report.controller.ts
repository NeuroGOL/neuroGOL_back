import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { pool } from '../config/db';

export class ReportController {
  /**
   * Obtener todos los reportes generados.
   */
  static async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await ReportService.getAllReports();
      res.json(reports); // ✅ Agregamos return aquí
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un reporte específico por ID.
   */
  static async getReportById(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const { id } = req.params;
      const report = await ReportService.getReportById(Number(id));

      if (!report) {
        return res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
      }

      return res.json(report); // ✅ Agregamos return aquí
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar un reporte automáticamente basándose en el último `analysis` y `nlp_analysis` del jugador.
   */
  static async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { player_id, generado_por } = req.body;
  
      // Verifica que los datos requeridos estén presentes
      if (!player_id || !generado_por) {
        res.status(400).json({ message: ERROR_MESSAGES.MISSING_PARAMETERS });
        return;
      }
  
      // Llamar al servicio para generar el reporte
      const newReport = await ReportService.generateReport(Number(player_id), Number(generado_por));
  
      // Devolver el reporte generado o el existente
      res.status(201).json(newReport);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un reporte por ID.
   */
  static async deleteReport(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const { id } = req.params;
      const deleted = await ReportService.deleteReport(Number(id));

      if (!deleted) {
        return res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
      }

      return res.json({ message: 'Reporte eliminado correctamente' }); // ✅ Agregamos return aquí
    } catch (error) {
      next(error);
    }
  }
}
