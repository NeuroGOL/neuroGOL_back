import { pool } from '../config/db';
import { Report } from '../models/report.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class ReportService {
  static async getAllReports(): Promise<Report[]> {
    try {
      const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      throw new Error(ERROR_MESSAGES.GET_REPORTS_ERROR);
    }
  }

  static async getReportById(id: number): Promise<Report | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo reporte por ID:', error);
      throw new Error(ERROR_MESSAGES.REPORT_NOT_FOUND);
    }
  }

  static async generateReport(player_id: number, generado_por: number): Promise<Report> {
    try {
      if (!player_id || isNaN(player_id)) throw new Error(ERROR_MESSAGES.INVALID_ID);
      if (!generado_por || isNaN(generado_por)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // 🔹 Verificar si el jugador existe
      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [player_id]);
      if (playerExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
      }

      // 🔹 Verificar si el usuario (analista) existe
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [generado_por]);
      if (userExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // 🔹 Obtener el análisis más reciente del jugador
      const analysisResult = await pool.query(
        `SELECT id FROM analysis WHERE player_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [player_id]
      );

      if (analysisResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.ANALYSIS_NOT_FOUND);
      }
      const analysis = analysisResult.rows[0];

      // 🔹 Obtener el análisis NLP más reciente del jugador
      const nlpResult = await pool.query(
        `SELECT id FROM nlp_analysis WHERE analysis_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [analysis.id]
      );

      if (nlpResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.NLP_NOT_FOUND);
      }
      const nlpAnalysis = nlpResult.rows[0];

      // 🔹 Insertar el reporte en la base de datos
      const result = await pool.query(
        `INSERT INTO reports (player_id, analysis_id, nlp_analysis_id, generado_por)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [player_id, analysis.id, nlpAnalysis.id, generado_por]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error generando reporte:', error);
      throw new Error(ERROR_MESSAGES.CREATE_REPORT_ERROR);
    }
  }

  static async deleteReport(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // 🔹 Verificar si el reporte existe antes de eliminar
      const reportExists = await pool.query('SELECT id FROM reports WHERE id = $1', [id]);
      if (reportExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.REPORT_NOT_FOUND);
      }

      const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      throw new Error(ERROR_MESSAGES.DELETE_REPORT_ERROR);
    }
  }
}
