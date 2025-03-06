export interface Emotion {
  id?: number;
  player_id: number;
  tipo: string; // Ejemplo: "Ansiedad", "Felicidad", "Estrés"
  intensidad: number; // Nivel de 1 a 10
  descripcion?: string;
  fecha: string; // Formato YYYY-MM-DD
  created_at?: Date;
}
