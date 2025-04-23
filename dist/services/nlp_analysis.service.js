"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NLPAnalysisService = void 0;
const db_1 = require("../config/db");
const generative_ai_1 = require("@google/generative-ai");
const errorMessages_1 = require("../utils/errorMessages");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GENERIC_API_KEY);
class NLPAnalysisService {
    static getAllNLPAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT * FROM nlp_analysis ORDER BY created_at DESC');
                return result.rows;
            }
            catch (error) {
                console.error('❌ Error obteniendo análisis NLP:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.GET_NLP_ERROR);
            }
        });
    }
    static getNLPAnalysisById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const result = yield db_1.pool.query('SELECT * FROM nlp_analysis WHERE id = $1', [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('❌ Error obteniendo análisis NLP por ID:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.NLP_NOT_FOUND);
            }
        });
    }
    static createNLPAnalysis(declaration_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("📥 ID recibido en createNLPAnalysis:", declaration_id);
                if (!declaration_id || isNaN(declaration_id)) {
                    console.error("❌ Error: ID de declaración inválido:", declaration_id);
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                }
                // 🔹 Obtener la declaración
                const declarationResult = yield db_1.pool.query('SELECT texto FROM declarations WHERE id = $1', [declaration_id]);
                if (declarationResult.rowCount === 0) {
                    console.error("❌ Declaración no encontrada:", declaration_id);
                    throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND);
                }
                const texto = declarationResult.rows[0].texto;
                if (!texto || texto.trim() === '') {
                    console.error("❌ La declaración está vacía.");
                    throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_TEXT_NOT_FOUND);
                }
                console.log("📜 Texto de la declaración:", texto);
                // 🔹 Análisis con IA
                const emocion_detectada = yield NLPAnalysisService.analyzeEmotionWithGemini(texto);
                const nlpResults = yield NLPAnalysisService.generateDetailedAnalysisWithGemini(texto, emocion_detectada);
                // 🔹 Insertar resultado en `nlp_analysis`
                const result = yield db_1.pool.query(`INSERT INTO nlp_analysis (declaration_id, emocion_detectada, tendencia_emocional, impacto_en_rendimiento, 
          impacto_en_equipo, estado_actual_emocional, rendimiento_predicho, resumen_general, acciones_recomendadas) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
                    declaration_id, emocion_detectada, nlpResults.tendencia_emocional, nlpResults.impacto_en_rendimiento,
                    nlpResults.impacto_en_equipo, nlpResults.estado_actual_emocional, nlpResults.rendimiento_predicho,
                    nlpResults.resumen_general, nlpResults.acciones_recomendadas
                ]);
                console.log("✅ Análisis NLP creado:", result.rows[0]);
                return result.rows[0];
            }
            catch (error) {
                console.error("❌ Error en createNLPAnalysis:", error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.CREATE_NLP_ERROR);
            }
        });
    }
    static deleteNLPAnalysis(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const nlpExists = yield db_1.pool.query('SELECT id FROM nlp_analysis WHERE id = $1', [id]);
                if (nlpExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.NLP_NOT_FOUND);
                }
                const result = yield db_1.pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('❌ Error eliminando análisis NLP:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.DELETE_NLP_ERROR);
            }
        });
    }
    // 🔹 Método para analizar emociones con Gemini
    static analyzeEmotionWithGemini(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `Detecta la emoción predominante en el siguiente texto y responde solo con la emoción detectada: "${text}"`;
                const response = yield genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
                const emotion = response.response.text();
                if (!emotion)
                    throw new Error('No se detectó ninguna emoción');
                return emotion.trim();
            }
            catch (error) {
                console.error('Error al analizar emoción con Gemini:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
            }
        });
    }
    // 🔹 Método para generar análisis detallado con Gemini
    static generateDetailedAnalysisWithGemini(text, emocion_detectada) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);
                let rawText = response.response.text();
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(rawText);
            }
            catch (error) {
                console.error('Error al generar análisis con Gemini:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.NLP_ANALYSIS_FAILED);
            }
        });
    }
}
exports.NLPAnalysisService = NLPAnalysisService;
