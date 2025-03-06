export interface NLPAnalysis {
  id?: number;
  player_id: number;
  fuente: string; // "Entrevista", "Redes Sociales", "Conferencia de prensa"
  texto: string; // Texto analizado
  emocion_detectada: string; // "Felicidad", "Ansiedad", "Ira", etc.
  confianza: number; // Valor entre 0 y 1
  analisis: string; // Resultado del análisis
  created_at?: Date;
}
