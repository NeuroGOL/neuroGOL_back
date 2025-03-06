import { pool } from '../config/db';
import { Report } from '../models/report.model';

export class ReportService {
  static async getReportsByPlayer(player_id: number): Promise<Report[]> {
    const result = await pool.query(
      'SELECT * FROM reports WHERE player_id = $1 ORDER BY created_at DESC',
      [player_id]
    );
    return result.rows;
  }

  static async getReportById(id: number): Promise<Report | null> {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createReport({
    player_id,
    tipo,
    datos,
    generado_por,
  }: Omit<Report, 'id' | 'created_at'>): Promise<Report> {
    const result = await pool.query(
      `INSERT INTO reports (player_id, tipo, datos, generado_por) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [player_id, tipo, datos, generado_por]
    );
    return result.rows[0];
  }

  static async deleteReport(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // 🔹 Generación automática de reportes basada en emociones registradas
  static async generateEmotionReport(player_id: number): Promise<Report | null> {
    const emotions = await pool.query(
      `SELECT tipo, intensidad, fecha FROM emotion WHERE player_id = $1 ORDER BY fecha DESC LIMIT 10`,
      [player_id]
    );

    if (emotions.rows.length === 0) return null;

    const datos = {
      resumen: `Últimas ${emotions.rows.length} emociones registradas`,
      emociones: emotions.rows,
    };

    return await ReportService.createReport({
      player_id,
      tipo: 'emocional',
      datos,
      generado_por: 'Sistema',
    });
  }
}
