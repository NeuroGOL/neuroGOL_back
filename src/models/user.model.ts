export interface User {
  id?: number;
  nombre: string;
  email: string;
  contrasena: string;
  role_id: number;
  profile_picture?: string;
  created_at?: Date;
}
