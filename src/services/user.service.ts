import { pool } from '../config/db';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await pool.query('SELECT id, nombre, email, role_id, profile_picture, created_at FROM users');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw new Error(ERROR_MESSAGES.GET_USERS_ERROR);
    }
  }

  static async getUserById(id: number): Promise<User | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const result = await pool.query(
        'SELECT id, nombre, email, role_id, profile_picture, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo usuario por ID:', error);
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || !email.includes('@')) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw new Error(ERROR_MESSAGES.GET_USERS_ERROR);
    }
  }

  static async createUser({
    nombre,
    email,
    contrasena,
    role_id,
    profile_picture
  }: Omit<User, 'id' | 'created_at'>): Promise<User> {
    try {
      if (!nombre || nombre.length < 3) throw new Error(ERROR_MESSAGES.NAME_TOO_SHORT);
      if (!email || !email.includes('@')) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
      if (!contrasena || contrasena.length < 6) throw new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      if (!role_id || isNaN(role_id)) throw new Error(ERROR_MESSAGES.INVALID_ROLE);

      // Verificar si el email ya está en uso
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
        throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      // Hashear la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const result = await pool.query(
        `INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, role_id, profile_picture, created_at`,
        [nombre, email, hashedPassword, role_id, profile_picture || null]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw new Error(ERROR_MESSAGES.CREATE_USER_ERROR);
    }
  }

  static async updateUser(
    id: number,
    { nombre, email, contrasena, role_id, profile_picture }: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<User | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // Verificar si el usuario existe antes de actualizar
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (userExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Validaciones opcionales
      if (nombre && nombre.length < 3) throw new Error(ERROR_MESSAGES.NAME_TOO_SHORT);
      if (email && !email.includes('@')) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
      if (contrasena && contrasena.length < 6) throw new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      if (role_id && isNaN(role_id)) throw new Error(ERROR_MESSAGES.INVALID_ROLE);

      const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : undefined;

      const result = await pool.query(
        `UPDATE users 
         SET nombre = COALESCE($1, nombre), 
             email = COALESCE($2, email), 
             contrasena = COALESCE($3, contrasena), 
             role_id = COALESCE($4, role_id), 
             profile_picture = COALESCE($5, profile_picture)
         WHERE id = $6 
         RETURNING id, nombre, email, role_id, profile_picture, created_at`,
        [nombre, email, hashedPassword, role_id, profile_picture, id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error(ERROR_MESSAGES.UPDATE_USER_ERROR);
    }
  }

  static async deleteUser(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // Verificar si el usuario existe antes de eliminar
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (userExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error(ERROR_MESSAGES.DELETE_USER_ERROR);
    }
  }
}
