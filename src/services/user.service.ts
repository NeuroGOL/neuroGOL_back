import { pool } from '../config/db';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    const result = await pool.query('SELECT id, nombre, email, role_id, profile_picture, created_at FROM users');
    return result.rows;
  }

  static async getUserById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT id, nombre, email, role_id, profile_picture, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async createUser({ nombre, email, contrasena, role_id, profile_picture }: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      `INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, role_id, profile_picture, created_at`,
      [nombre, email, hashedPassword, role_id, profile_picture || null]
    );

    return result.rows[0];
  }

  static async updateUser(id: number, { nombre, email, contrasena, role_id, profile_picture }: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null> {
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
  }

  static async deleteUser(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
