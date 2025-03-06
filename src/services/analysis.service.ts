import { pool } from '../config/db';
import { Analysis } from '../models/analysis.model';

export class AnalysisService {
  static async getAllAnalysis(): Promise<Analysis[]> {
    const result = await pool.query('SELECT * FROM analysis ORDER BY created_at DESC');
    return result.rows;
  }

  static async getAnalysisById(id: number): Promise<Analysis | null> {
    const result = await pool.query('SELECT * FROM analysis WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createAnalysis({ player_id, user_id, categoria_texto, texto }: Omit<Analysis, 'id' | 'created_at'>): Promise<Analysis> {
    const result = await pool.query(
      `INSERT INTO analysis (player_id, user_id, categoria_texto, texto) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [player_id, user_id, categoria_texto, texto]
    );
    return result.rows[0];
  }

  static async updateAnalysis(id: number, { categoria_texto, texto }: Partial<Omit<Analysis, 'id' | 'player_id' | 'user_id' | 'created_at'>>): Promise<Analysis | null> {
    const result = await pool.query(
      `UPDATE analysis 
       SET categoria_texto = COALESCE($1, categoria_texto), 
           texto = COALESCE($2, texto)
       WHERE id = $3 
       RETURNING *`,
      [categoria_texto, texto, id]
    );
    return result.rows[0] || null;
  }

  static async deleteAnalysis(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM analysis WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
