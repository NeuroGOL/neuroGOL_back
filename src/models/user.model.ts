export interface User {
  id?: number;
  nombre: string;
  email: string;
  contrasena?: string; // Opcional para evitar que se filtre en respuestas
  role_id?: number;
  profile_picture?: string;
  created_at?: Date;
}
