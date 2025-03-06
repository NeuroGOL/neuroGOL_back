export interface AIModel {
  id?: number;
  player_id: number;
  modelo: string; // Nombre del modelo de IA (ej. "Red neuronal", "Regresión")
  prediccion: any; // JSON con la predicción de emociones
  precision: number; // Valor entre 0 y 1 que indica la confianza del modelo
  creado_por: string; // "Sistema" o usuario
  created_at?: Date;
}
