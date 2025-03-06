import { pool } from '../config/db';
import { AIModel } from '../models/ai_model.model';

export class AIModelService {
  static async getPredictionsByPlayer(player_id: number): Promise<AIModel[]> {
    const result = await pool.query(
      'SELECT * FROM ai_models WHERE player_id = $1 ORDER BY created_at DESC',
      [player_id]
    );
    return result.rows;
  }

  static async getPredictionById(id: number): Promise<AIModel | null> {
    const result = await pool.query('SELECT * FROM ai_models WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createPrediction({
    player_id,
    modelo,
    prediccion,
    precision,
    creado_por,
  }: Omit<AIModel, 'id' | 'created_at'>): Promise<AIModel> {
    const result = await pool.query(
      `INSERT INTO ai_models (player_id, modelo, prediccion, precision, creado_por) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [player_id, modelo, prediccion, precision, creado_por]
    );
    return result.rows[0];
  }

  static async deletePrediction(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM ai_models WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // 🔹 Simulación de una predicción de emociones usando IA
  static async predictEmotion(player_id: number): Promise<AIModel> {
    const emociones = ['Felicidad', 'Ansiedad', 'Ira', 'Tristeza', 'Confianza'];
    const prediccion = {
      emocion: emociones[Math.floor(Math.random() * emociones.length)],
      probabilidad: parseFloat((Math.random() * (1 - 0.6) + 0.6).toFixed(3)), // Nivel de confianza entre 0.6 y 1
    };

    return await AIModelService.createPrediction({
      player_id,
      modelo: 'Red Neuronal',
      prediccion,
      precision: prediccion.probabilidad,
      creado_por: 'Sistema',
    });
  }
}
