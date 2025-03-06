import { pool } from '../config/db';
import { Report } from '../models/report.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { NLPAnalysisService } from './nlp_analysis.service'; // Importar servicio de NLP

export class ReportService {
  static async getAllReports(): Promise<Report[]> {
    const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    return result.rows;
  }

  static async getReportById(id: number): Promise<Report | null> {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async generateReport(player_id: number, generado_por: number): Promise<Report> {
    try {
      // 🔹 Verificar si el usuario que genera el reporte existe
      const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [generado_por]);
      if (userResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // 🔹 Obtener el análisis más reciente del jugador
      const analysisResult = await pool.query(
        `SELECT id, texto FROM analysis WHERE player_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [player_id]
      );

      if (analysisResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.ANALYSIS_NOT_FOUND);
      }

      const analysis = analysisResult.rows[0];

      // 🔹 Verificar que el texto no sea vacío o undefined
      if (!analysis.texto || analysis.texto.trim() === "") {
        throw new Error(ERROR_MESSAGES.ANALYSIS_TEXT_NOT_FOUND);
      }

      // 🔹 Generar el NLP Analysis usando el texto del análisis manual
      const nlpAnalysis = await NLPAnalysisService.createNLPAnalysis(analysis.id);

      // 🔹 Insertar el reporte en la base de datos
      const result = await pool.query(
        `INSERT INTO reports (player_id, analysis_id, nlp_analysis_id, generado_por)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [player_id, analysis.id, nlpAnalysis.id, generado_por]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      throw new Error(ERROR_MESSAGES.CREATE_REPORT_ERROR);
    }
  }
  static async deleteReport(id: number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      throw new Error(ERROR_MESSAGES.DELETE_REPORT_ERROR);
    }
  }
}
