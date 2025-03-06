import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class ReportController {
  static async getReportsByPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const reports = await ReportService.getReportsByPlayer(Number(player_id));
      res.json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_REPORTS_ERROR });
    }
  }

  static async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await ReportService.getReportById(Number(id));

      if (!report) {
        res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
        return;
      }

      res.json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.GET_REPORTS_ERROR });
    }
  }

  static async createReport(req: Request, res: Response): Promise<void> {
    try {
      const newReport = await ReportService.createReport(req.body);
      res.status(201).json(newReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_REPORT_ERROR });
    }
  }

  static async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ReportService.deleteReport(Number(id));

      if (!deleted) {
        res.status(404).json({ message: ERROR_MESSAGES.REPORT_NOT_FOUND });
        return;
      }

      res.json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.DELETE_REPORT_ERROR });
    }
  }

  static async generateEmotionReport(req: Request, res: Response): Promise<void> {
    try {
      const { player_id } = req.params;
      const report = await ReportService.generateEmotionReport(Number(player_id));

      if (!report) {
        res.status(404).json({ message: 'No hay suficientes emociones registradas para generar un reporte' });
        return;
      }

      res.status(201).json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ERROR_MESSAGES.CREATE_REPORT_ERROR });
    }
  }
}
