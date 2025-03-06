export interface NLPAnalysis {
  id?: number;
  analysis_id: number;  // Relación con `analysis`
  emocion_detectada: string;
  tendencia_emocional: string;
  impacto_en_rendimiento: string;
  impacto_en_equipo: string;
  estado_actual_emocional: string;
  rendimiento_predicho: string;
  resumen_general: string;
  acciones_recomendadas: string;
  created_at?: Date;
}
