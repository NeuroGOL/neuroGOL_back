import { pool } from '../config/db';
import { GoogleGenerativeAI } from '@google/generative-ai';  // Asegúrate de instalar este paquete
import { NLPAnalysis } from '../models/nlp.model';  // El modelo para la base de datos

const genAI = new GoogleGenerativeAI('AIzaSyBiF2sz9fpD7OUkyotW4zhSR8x86DuXmOA');  // API Key de Gemini

export class NLPService {
  // Obtener todos los análisis de un jugador
  static async getAnalysisByPlayer(player_id: number): Promise<NLPAnalysis[]> {
    const result = await pool.query(
      'SELECT * FROM nlp_analysis WHERE player_id = $1 ORDER BY created_at DESC',
      [player_id]
    );
    return result.rows;
  }

  // Obtener un análisis específico por ID
  static async getAnalysisById(id: number): Promise<NLPAnalysis | null> {
    const result = await pool.query('SELECT * FROM nlp_analysis WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Crear un nuevo análisis en la base de datos
  static async createAnalysis({
    player_id,
    fuente,
    texto,
    emocion_detectada,
    confianza,
    analisis,
  }: Omit<NLPAnalysis, 'id' | 'created_at'>): Promise<NLPAnalysis> {
    const result = await pool.query(
      `INSERT INTO nlp_analysis (player_id, fuente, texto, emocion_detectada, confianza, analisis) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [player_id, fuente, texto, emocion_detectada, confianza, analisis]
    );
    return result.rows[0];
  }

  // Eliminar un análisis específico por ID
  static async deleteAnalysis(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Función para analizar el texto usando Gemini y generar el análisis detallado
  static async analyzeText(player_id: number, fuente: string, texto: string): Promise<void> {
    let emocion_detectada = '';
    let confianza = 0;
    let analisis = '';

    try {
      // Llamamos a Gemini para obtener la emoción detectada
      emocion_detectada = await NLPService.analyzeEmotionWithGemini(texto);  // Llamada al servicio de Gemini para emoción

      // Simulamos la confianza obtenida en el análisis (esto depende de la API de Gemini)
      confianza = parseFloat((Math.random() * (1 - 0.5) + 0.5).toFixed(3)); // Esto debe ser reemplazado con el valor real de confianza

      // Llamamos a Gemini para generar un análisis detallado del texto
      analisis = await NLPService.generateDetailedAnalysisWithGemini(texto, emocion_detectada);

      // Imprimir en consola los resultados antes de cualquier cambio en la base de datos
      console.log('Texto Analizado:', texto);
      console.log('Emoción Detectada:', emocion_detectada);
      console.log('Análisis Detallado:', analisis);
      console.log('Confianza:', confianza);

      // Ahora guardamos en la base de datos
      await NLPService.createAnalysis({
        player_id,
        fuente,
        texto,
        emocion_detectada,
        confianza,
        analisis, // Guardamos el análisis generado
      });

    } catch (error) {
      console.error('Error al analizar el texto:', error);
      throw new Error('Error al analizar el texto');
    }
  }

  // Función para analizar la emoción usando Gemini
  static async analyzeEmotionWithGemini(text: string): Promise<string> {
    try {
      const prompt = `Detecta la emoción en el siguiente texto. Responde solo con una emoción como 'Tristeza', 'Alegría', 'Rabia', etc. El texto es: "${text}"`;

      // Usamos el modelo de Gemini para detectar la emoción
      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);

      const emotion = response.response.text();
      if (!emotion) {
        throw new Error('No emotion detected');
      }

      return emotion.trim();  // Regresamos la emoción detectada (Tristeza, Alegría, etc.)
    } catch (error) {
      console.error('Error al llamar a la API de Gemini para la emoción:', error);
      throw new Error('GEMINI_ERROR');
    }
  }

  // Función para generar un análisis detallado del texto usando Gemini
  static async generateDetailedAnalysisWithGemini(text: string, emocion_detectada: string): Promise<string> {
    try {
      const prompt = `Analiza la siguiente declaración de un jugador de fútbol: "${text}". 

      1. **Detección de Emoción:** La emoción detectada es "${emocion_detectada}". Explica detalladamente qué palabras o expresiones en el texto sugieren esta emoción.  

      2. **Impacto en el Rendimiento:** Evalúa cómo la emoción "${emocion_detectada}" podría influir en el desempeño del jugador en el campo, considerando factores como concentración, motivación, confianza y toma de decisiones.  

      3. **Comparación con Patrones Previos:** Determina si la emoción "${emocion_detectada}" es consistente con declaraciones anteriores del jugador. ¿Se observa una tendencia emocional estable, una variación repentina o un posible patrón preocupante?  

      4. **Influencia en la Dinámica del Equipo:** Analiza cómo la emoción "${emocion_detectada}" podría afectar la relación del jugador con sus compañeros, el entrenador y el ambiente general del equipo.  

      5. **Factores Externos:** Identifica si hay eventos recientes (por ejemplo, resultados de partidos, presión mediática, conflictos internos o declaraciones anteriores) que podrían haber influido en la emoción "${emocion_detectada}".  

      6. **Recomendaciones:** Con base en el análisis, sugiere estrategias o acciones que el cuerpo técnico o el jugador podrían implementar para gestionar la emoción "${emocion_detectada}" de manera efectiva.  

      Proporciona un análisis detallado considerando el contexto del Fútbol Profesional Colombiano (FPC) y la importancia de la salud emocional en el rendimiento deportivo.`;

      // Llamamos a Gemini para generar el análisis detallado
      const response = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent(prompt);

      const analysis = response.response.text();
      if (!analysis) {
        throw new Error('Failed to generate analysis');
      }

      return analysis;
    } catch (error) {
      console.error('Error al generar análisis con Gemini:', error);
      throw new Error('GEMINI_ERROR');
    }
  }
}
