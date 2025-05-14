import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

export class AuthService {
  static async register({ nombre, email, contrasena, role_id, profile_picture }: Omit<User, 'id' | 'created_at'>): Promise<{ message: string }> {
    try {
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

      if (existingUser.rowCount && existingUser.rowCount > 0) {
        throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      if (!contrasena) {
        throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
      }
      
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      await pool.query(
        `INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5)`,
        [nombre, email, hashedPassword, role_id, profile_picture || null]
      );

      return { message: 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_MESSAGES.REGISTRATION_ERROR);
    }
  }

  static async login(email: string, contrasena: string): Promise<{ token: string; user: Partial<User> }> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);

      if (!isMatch) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role_id: user.role_id,
          profile_picture: user.profile_picture
        }
      };
    } catch (error) {
      console.error(error);
      throw new Error(ERROR_MESSAGES.LOGIN_ERROR);
    }
  }
}
