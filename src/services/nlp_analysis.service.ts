import { pool } from '../config/db';
import { NLPAnalysis } from '../models/nlp_analysis.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { log } from 'console';
import { NextFunction, Request, Response } from 'express';

const genAI = new GoogleGenerativeAI(process.env.GENERIC_API_KEY!);

export class NLPAnalysisService {
  static async getAllNLPAnalysis(): Promise<NLPAnalysis[]> {
    try {
      const result = await pool.query('SELECT * FROM nlp_analysis ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('❌ Error obteniendo análisis NLP:', error);
      throw new Error(ERROR_MESSAGES.GET_NLP_ERROR);
    }
  }

  static async getNLPAnalysisById(id: number): Promise<NLPAnalysis | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const result = await pool.query('SELECT * FROM nlp_analysis WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error obteniendo análisis NLP por ID:', error);
      throw new Error(ERROR_MESSAGES.NLP_NOT_FOUND);
    }
  }

  static async createNLPAnalysis(declaration_id: number): Promise<NLPAnalysis> {
    try {
      console.log("📥 ID recibido en createNLPAnalysis:", declaration_id);

      if (!declaration_id || isNaN(declaration_id)) {
        console.error("❌ Error: ID de declaración inválido:", declaration_id);
        throw new Error(ERROR_MESSAGES.INVALID_ID);
      }

      // 🔹 Obtener la declaración
      const declarationResult = await pool.query('SELECT texto FROM declarations WHERE id = $1', [declaration_id]);

      if (declarationResult.rowCount === 0) {
        console.error("❌ Declaración no encontrada:", declaration_id);
        throw new Error(ERROR_MESSAGES.DECLARATION_NOT_FOUND);
      }

      const texto = declarationResult.rows[0].texto;

      if (!texto || texto.trim() === '') {
        console.error("❌ La declaración está vacía.");
        throw new Error(ERROR_MESSAGES.DECLARATION_TEXT_NOT_FOUND);
      }

      console.log("📜 Texto de la declaración:", texto);

      // 🔹 Análisis con IA
      const emocion_detectada = await NLPAnalysisService.analyzeEmotionWithGemini(texto);
      const nlpResults = await NLPAnalysisService.generateDetailedAnalysisWithGemini(texto, emocion_detectada);

      // 🔹 Insertar resultado en `nlp_analysis`
      const result = await pool.query(
        `INSERT INTO nlp_analysis (declaration_id, emocion_detectada, tendencia_emocional, impacto_en_rendimiento, 
          impacto_en_equipo, estado_actual_emocional, rendimiento_predicho, resumen_general, acciones_recomendadas) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          declaration_id, emocion_detectada, nlpResults.tendencia_emocional, nlpResults.impacto_en_rendimiento,
          nlpResults.impacto_en_equipo, nlpResults.estado_actual_emocional, nlpResults.rendimiento_predicho,
          nlpResults.resumen_general, nlpResults.acciones_recomendadas
        ]
      );

      console.log("✅ Análisis NLP creado:", result.rows[0]);
      return result.rows[0];

    } catch (error) {
      console.error("❌ Error en createNLPAnalysis:", error);
      throw new Error(ERROR_MESSAGES.CREATE_NLP_ERROR);
    }
  }

  static async deleteNLPAnalysis(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const nlpExists = await pool.query('SELECT id FROM nlp_analysis WHERE id = $1', [id]);
      if (nlpExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.NLP_NOT_FOUND);
      }

      const result = await pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('❌ Error eliminando análisis NLP:', error);
      throw new Error(ERROR_MESSAGES.DELETE_NLP_ERROR);
    }
  }

  // 🔹 Método para analizar emociones con Gemini
  static async analyzeEmotionWithGemini(text: string): Promise<string> {
    try {
      const prompt = `Detecta la emoción predominante en el siguiente texto y responde solo con la emoción detectada: "${text}"`;

      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
      const emotion = response.response.text();

      if (!emotion) throw new Error('No se detectó ninguna emoción');

      return emotion.trim();
    } catch (error) {
      console.error('Error al analizar emoción con Gemini:', error);
      throw new Error(ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
    }
  }

  // 🔹 Método para generar análisis detallado con Gemini
  static async generateDetailedAnalysisWithGemini(text: string, emocion_detectada: string) {
    try {
      const prompt = `Analiza la siguiente declaración: "${text}". La emoción detectada es "${emocion_detectada}".  

      Devuelve un JSON con:
      {
        "tendencia_emocional": "Describe cómo han cambiado las emociones a lo largo del tiempo.",
        "impacto_en_rendimiento": "Positivo / Negativo / Neutro",
        "impacto_en_equipo": "Positivo / Negativo / Neutro",
        "estado_actual_emocional": "Estable / Inestable / En riesgo",
        "rendimiento_predicho": "Alto / Medio / Bajo",
        "resumen_general": "Explicación breve y consecuencias positivas o negativas dependiendo de la situación (en contexto futbol).",
        "acciones_recomendadas": "Sugerencias para mejorar el estado emocional/rendimiento o cómo mantenerlo."
      }

      Responde solo con el JSON, sin texto adicional.`;

      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
      let rawText = response.response.text();

      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(rawText);
    } catch (error) {
      console.error('Error al generar análisis con Gemini:', error);
      throw new Error(ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
    }
  }
}
