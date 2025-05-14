import { pool } from '../config/db';
import { NLPAnalysis } from '../models/nlp_analysis.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { log } from 'console';
import { NextFunction, Request, Response } from 'express';
import { pipeline } from '@xenova/transformers';

const genAI = new GoogleGenerativeAI(process.env.GENERIC_API_KEY!);
let emotionClassifier: any = null;

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
    console.log("✅ ESTE ES EL ARCHIVO CORRECTO: NLPAnalysisService.ts");

    try {
      
      console.log("📥 ID recibido en createNLPAnalysis:", declaration_id);

      if (!declaration_id || isNaN(declaration_id)) {
        throw new Error(ERROR_MESSAGES.INVALID_ID);
      }

      const declarationResult = await pool.query('SELECT texto FROM declarations WHERE id = $1', [declaration_id]);
      if (declarationResult.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.DECLARATION_NOT_FOUND);
      }

      const texto = declarationResult.rows[0].texto;
      if (!texto || texto.trim() === '') {
        throw new Error(ERROR_MESSAGES.DECLARATION_TEXT_NOT_FOUND);
      }

      console.log("📜 Texto de la declaración:", texto);

      // Análisis de emoción y score con Hugging Face
      console.log("➡️ Analizando emoción...");
      const emocion_ingles = await NLPAnalysisService.analyzeEmotionWithHuggingFace(texto);

      const emocion_detectada = await NLPAnalysisService.translateEmotionToSpanishWithGemini(emocion_ingles.emotion);
      const rendimiento_predicho = emocion_ingles.score;
      console.log("✅ RENDIMIENTO PREDICHO:", rendimiento_predicho);

      // Generar análisis con Gemini
      const geminiData = await NLPAnalysisService.generateDetailedAnalysisWithGemini(texto, emocion_detectada);

      // ⚠️ Asegurarse de ignorar cualquier campo extra que devuelva Gemini
      delete geminiData.rendimiento_predicho;

      const {
        tendencia_emocional,
        impacto_en_rendimiento,
        impacto_en_equipo,
        estado_actual_emocional,
        resumen_general,
        acciones_recomendadas
      } = geminiData;

      // Insertar resultado final
      const result = await pool.query(
        `INSERT INTO nlp_analysis (
        declaration_id, emocion_detectada, tendencia_emocional, impacto_en_rendimiento,
        impacto_en_equipo, estado_actual_emocional, rendimiento_predicho, resumen_general, acciones_recomendadas
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          declaration_id,
          emocion_detectada,
          tendencia_emocional,
          impacto_en_rendimiento,
          impacto_en_equipo,
          estado_actual_emocional,
          rendimiento_predicho, // ✅ ahora sí viene directo del modelo
          resumen_general,
          acciones_recomendadas
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
  static async analyzeEmotionWithHuggingFace(text: string): Promise<{ emotion: string, score: number }> {
    try {
      console.log("🚀 Entrando a analyzeEmotionWithHuggingFace");
      // Traduce el texto
      const translatedText = await NLPAnalysisService.translateToEnglishWithGemini(text);

      if (!emotionClassifier) {
        emotionClassifier = await pipeline(
          'text-classification',
          'Xenova/j-hartmann/emotion-english-distilroberta-base',
          { quantized: true }
        );
      }

      const result = await emotionClassifier(translatedText, { return_all_scores: true });
      const scores = result[0];

      // Obtener emoción con mayor score
      const topEmotion = scores.reduce((max: { label: string; score: number }, curr: { label: string; score: number }) =>
        curr.score > max.score ? curr : max
      );
      const emotionInEnglish = topEmotion.label;
      const score = parseFloat((topEmotion.score * 100).toFixed(2)); // para tener un valor 0–100

      console.log("🎯 Emoción:", emotionInEnglish, "📊 Score:", score);

      // Traducir la emoción
      const emotionInSpanish = await NLPAnalysisService.translateEmotionToSpanishWithGemini(emotionInEnglish);

      return { emotion: emotionInSpanish, score };

    } catch (error) {
      console.error("❌ Error en análisis de emoción:", error);
      throw new Error("Error al analizar emoción con Hugging Face.");
    }
  }


  // 🔹 Método para generar análisis detallado con Gemini
  static async generateDetailedAnalysisWithGemini(text: string, emocion_detectada: string) {
    try {
      const prompt = `Analiza la siguiente declaración: "${text}". La emoción detectada es "${emocion_detectada}".  

Devuelve un JSON SOLO con estos campos:
{
  "tendencia_emocional": "...",
  "impacto_en_rendimiento": "...",
  "impacto_en_equipo": "...",
  "estado_actual_emocional": "...",
  "resumen_general": "...",
  "acciones_recomendadas": "..."
}

NO incluyas ningún campo adicional. Responde solo con el JSON, sin explicaciones.`;

      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
      let rawText = response.response.text();

      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(rawText);
    } catch (error) {
      console.error('Error al generar análisis con Gemini:', error);
      throw new Error(ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
    }
  }

  static async translateToEnglishWithGemini(text: string): Promise<string> {
    try {
      const prompt = `Traduce el siguiente texto del español al inglés. Responde solo con la traducción, sin explicaciones:\n"${text}"`;

      const response = await genAI
        .getGenerativeModel({ model: 'gemini-2.0-pro' }) // o el modelo que estés usando
        .generateContent(prompt);

      const translatedText = response.response.text().trim();
      console.log("🔄 Traducción (Gemini):", translatedText);
      return translatedText;
    } catch (error) {
      console.error("❌ Error al traducir con Gemini:", error);
      throw new Error("Error al traducir el texto al inglés.");
    }
  }

  static async translateEmotionToSpanishWithGemini(emotion: string): Promise<string> {
    try {
      const prompt = `Traduce al español solo esta palabra de emoción: "${emotion}". Responde únicamente con la traducción.`;

      const response = await genAI
        .getGenerativeModel({ model: 'gemini-2.0-pro' })
        .generateContent(prompt);

      const translatedEmotion = response.response.text().trim().toLowerCase();

      console.log("🌐 Emoción traducida:", translatedEmotion);
      return translatedEmotion;
    } catch (error) {
      console.error("❌ Error traduciendo emoción con Gemini:", error);
      throw new Error("Error al traducir la emoción al español.");
    }
  }

}
