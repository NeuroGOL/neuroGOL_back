import { pool } from '../config/db';
import { NLPAnalysis } from '../models/nlp.model';

export class NLPService {
  static async getAnalysisByPlayer(player_id: number): Promise<NLPAnalysis[]> {
    const result = await pool.query(
      'SELECT * FROM nlp_analysis WHERE player_id = $1 ORDER BY created_at DESC',
      [player_id]
    );
    return result.rows;
  }

  static async getAnalysisById(id: number): Promise<NLPAnalysis | null> {
    const result = await pool.query('SELECT * FROM nlp_analysis WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createAnalysis({
    player_id,
    fuente,
    texto,
    emocion_detectada,
    confianza,
  }: Omit<NLPAnalysis, 'id' | 'created_at'>): Promise<NLPAnalysis> {
    const result = await pool.query(
      `INSERT INTO nlp_analysis (player_id, fuente, texto, emocion_detectada, confianza) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [player_id, fuente, texto, emocion_detectada, confianza]
    );
    return result.rows[0];
  }

  static async deleteAnalysis(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // 🔹 Simulación de IA para analizar textos
  static async analyzeText(player_id: number, fuente: string, texto: string): Promise<NLPAnalysis> {
    const emociones = ['Felicidad', 'Ansiedad', 'Ira', 'Tristeza', 'Confianza'];
    const emocion_detectada = emociones[Math.floor(Math.random() * emociones.length)];
    const confianza = parseFloat((Math.random() * (1 - 0.5) + 0.5).toFixed(3)); // Nivel de confianza entre 0.5 y 1

    return await NLPService.createAnalysis({
      player_id,
      fuente,
      texto,
      emocion_detectada,
      confianza,
    });
  }
}
