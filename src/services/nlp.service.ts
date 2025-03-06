import { pool } from '../config/db';
import { HuggingFaceService } from './huggingface.service'; // Importamos el servicio HuggingFace
import { NLPAnalysis } from '../models/nlp.model';  // El modelo para la base de datos

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
}: Omit<NLPAnalysis, 'id' | 'created_at'>): Promise<NLPAnalysis> {
  const result = await pool.query(
    `INSERT INTO nlp_analysis (player_id, fuente, texto, emocion_detectada, confianza) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [player_id, fuente, texto, emocion_detectada, confianza]
  );
  return result.rows[0];
}

// Eliminar un análisis específico por ID
static async deleteAnalysis(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM nlp_analysis WHERE id = $1 RETURNING id', [id]);
  return result.rowCount !== null && result.rowCount > 0;
}

// Función para analizar el texto usando Hugging Face y guardar el resultado
static async analyzeText(player_id: number, fuente: string, texto: string): Promise<NLPAnalysis> {
  let emocion_detectada = '';
  let confianza = 0;

  try {
    // Bucle de reintentos hasta obtener una confianza > 90%
    while (confianza < 0.9) {
      // Llamamos al servicio HuggingFace para obtener la emoción detectada
      emocion_detectada = await HuggingFaceService.analyzeEmotion(texto);  // Llamada al servicio de HuggingFace

      // Simulamos la confianza obtenida en el análisis (esto depende de la API de Hugging Face)
      // En este ejemplo, se obtiene un valor de confianza simulado, ya que Hugging Face no lo devuelve explícitamente
      // En un caso real, se usaría el valor `score` o `confidence` devuelto por la API
      confianza = parseFloat((Math.random() * (1 - 0.5) + 0.5).toFixed(3)); // Esto debe ser reemplazado con el valor real de confianza

      // Si la confianza es mayor o igual a 0.9, salimos del bucle
      if (confianza >= 0.9) {
        break;
      }

      console.log(`Reintentando análisis de texto... Confianza: ${confianza}`);
    }

    // Guardamos el análisis en la base de datos
    return await NLPService.createAnalysis({
      player_id,
      fuente,
      texto,
      emocion_detectada,
      confianza,
    });
  } catch (error) {
    console.error('Error al analizar el texto:', error);
    throw new Error('Error al analizar el texto');
  }
}
}
