import { pool } from '../config/db';
import { NLPAnalysis } from '../models/nlp_analysis.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const genAI = new GoogleGenerativeAI(process.env.GENERIC_API_KEY!);

export class NLPAnalysisService {
  static async getAllNLPAnalysis(): Promise<NLPAnalysis[]> {
    const result = await pool.query('SELECT * FROM nlp_analysis ORDER BY created_at DESC');
    return result.rows;
  }

  static async getNLPAnalysisById(id: number): Promise<NLPAnalysis | null> {
    const result = await pool.query('SELECT * FROM nlp_analysis WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createNLPAnalysis(analysis_id: number): Promise<NLPAnalysis> {
    try {
      // 🔹 Obtener el texto desde el analysis_id
      const analysisResult = await pool.query(
        `SELECT texto FROM analysis WHERE id = $1`, [analysis_id]
      );

      if (analysisResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.ANALYSIS_NOT_FOUND);
      }

      const texto = analysisResult.rows[0].texto;

      // 🔹 Verificar que el texto no sea undefined o vacío
      if (!texto || texto.trim() === "") {
        throw new Error(ERROR_MESSAGES.ANALYSIS_TEXT_NOT_FOUND);
      }

      // 🔹 Enviar el texto real a la IA para análisis
      const emocion_detectada = await this.analyzeEmotionWithGemini(texto);
      const nlpResults = await this.generateDetailedAnalysisWithGemini(texto, emocion_detectada);

      const result = await pool.query(
        `INSERT INTO nlp_analysis (analysis_id, emocion_detectada, tendencia_emocional, impacto_en_rendimiento, 
          impacto_en_equipo, estado_actual_emocional, rendimiento_predicho, resumen_general, acciones_recomendadas) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          analysis_id, emocion_detectada, nlpResults.tendencia_emocional, nlpResults.impacto_en_rendimiento,
          nlpResults.impacto_en_equipo, nlpResults.estado_actual_emocional, nlpResults.rendimiento_predicho,
          nlpResults.resumen_general, nlpResults.acciones_recomendadas
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear el análisis NLP:', error);
      throw new Error(ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
    }
  }

  static async deleteNLPAnalysis(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static async analyzeEmotionWithGemini(text: string): Promise<string> {
    try {
      const prompt = `Detecta la emoción predominante en el siguiente texto: "${text}". Responde solo con la emoción detectada.`;

      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
      const emotion = response.response.text();

      if (!emotion) throw new Error('No emotion detected');

      return emotion.trim();
    } catch (error) {
      console.error('Error al analizar emoción con Gemini:', error);
      throw new Error(ERROR_MESSAGES.GEMINI_ERROR);
    }
  }

  private static async generateDetailedAnalysisWithGemini(text: string, emocion_detectada: string) {
    try {
      const prompt = `Analiza la siguiente declaración de un jugador de fútbol: "${text}". La emoción detectada es "${emocion_detectada}".  

        Devuelve la respuesta en formato JSON con las siguientes claves:
        {
          "tendencia_emocional": "Explicación sobre cómo han cambiado las emociones con el tiempo.",
          "impacto_en_rendimiento": "Positivo / Negativo / Neutro",
          "impacto_en_equipo": "Positivo / Negativo / Neutro",
          "estado_actual_emocional": "Estable / Inestable / En riesgo",
          "rendimiento_predicho": "Alto / Medio / Bajo",
          "resumen_general": "Resumen detallado del estado emocional del jugador y su posible impacto en el rendimiento.",
          "acciones_recomendadas": "Recomendaciones para mejorar el estado emocional del jugador."
        }

        Responde ÚNICAMENTE con el JSON, sin incluir texto adicional, sin notas, sin \`\`\`json ni \`\`\`.`;

      // Llamada a Gemini para obtener la respuesta
      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
      let rawText = response.response.text();

      // 🔹 Depuración: Ver la respuesta en consola antes de procesarla
      console.log("Respuesta de Gemini (sin procesar):", rawText);

      // 🔹 Eliminar los posibles triple comillas invertidas (` ```json ` y ` ``` `)
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

      // 🔹 Convertir la respuesta limpia a JSON
      const analysis = JSON.parse(rawText);

      return {
        tendencia_emocional: analysis.tendencia_emocional,
        impacto_en_rendimiento: analysis.impacto_en_rendimiento,
        impacto_en_equipo: analysis.impacto_en_equipo,
        estado_actual_emocional: analysis.estado_actual_emocional,
        rendimiento_predicho: analysis.rendimiento_predicho,
        resumen_general: analysis.resumen_general,
        acciones_recomendadas: analysis.acciones_recomendadas
      };
    } catch (error) {
      console.error('Error al generar análisis con Gemini:', error);
      throw new Error('GEMINI_ERROR');
    }
  }
}
