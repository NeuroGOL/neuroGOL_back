export interface Report {
  id?: number;
  player_id: number;
  tipo: 'emocional' | 'tendencia'; // Análisis de emociones o tendencias
  datos: any; // JSON con estadísticas de emociones
  generado_por: string; // "Sistema" o usuario
  created_at?: Date;
}
