import { pool } from '../config/db';
import { Emotion } from '../models/emotion.model';

export class EmotionService {
  static async getEmotionsByPlayer(player_id: number): Promise<Emotion[]> {
    const result = await pool.query(
      'SELECT * FROM emotion WHERE player_id = $1 ORDER BY fecha DESC',
      [player_id]
    );
    return result.rows;
  }

  static async getEmotionById(id: number): Promise<Emotion | null> {
    const result = await pool.query('SELECT * FROM emotion WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createEmotion({
    player_id,
    tipo,
    intensidad,
    descripcion,
    fecha,
  }: Omit<Emotion, 'id' | 'created_at'>): Promise<Emotion> {
    const result = await pool.query(
      `INSERT INTO emotion (player_id, tipo, intensidad, descripcion, fecha) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [player_id, tipo, intensidad, descripcion || null, fecha]
    );
    return result.rows[0];
  }

  static async deleteEmotion(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM emotion WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
