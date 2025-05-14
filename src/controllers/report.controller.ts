import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class ReportController {
  static async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await ReportService.getAllReports();
      res.json(reports);
    } catch (error) {
      next(error);
    }
  }

  static async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const report = await ReportService.getReportById(Number(id));

      if (!report) {
        res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
        return;
      }

      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { declaration_id, generado_por } = req.body;

      if (!declaration_id || !generado_por) {
        res.status(400).json({ message: ERROR_MESSAGES.MISSING_PARAMETERS });
        return;
      }

      const newReport = await ReportService.generateReport(Number(declaration_id), Number(generado_por));

      res.status(201).json(newReport);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ReportService.deleteReport(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
        return;
      }

      res.json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
