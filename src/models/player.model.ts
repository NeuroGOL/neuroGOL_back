export interface Player {
  id?: number;
  nombre: string;
  equipo: string;
  fecha_nacimiento: string; // Formato YYYY-MM-DD
  nacionalidad: string;
  profile_picture?: string; // URL de la imagen del jugador
  created_at?: Date;
}
