export interface Player {
  id?: number;
  nombre: string;
  equipo: string;
  fecha_nacimiento: Date;
  nacionalidad: string;
  profile_picture?: string;
  created_at?: Date;
}
