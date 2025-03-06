import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

export class AuthService {
  static async register({ nombre, email, contrasena, role_id, profile_picture }: Omit<User, 'id' | 'created_at'>): Promise<{ message: string }> {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser && existingUser.rowCount !== null && existingUser.rowCount > 0) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, email, hashedPassword, role_id, profile_picture || null]
    );

    return { message: 'Usuario registrado exitosamente' };
  }

  static async login(email: string, contrasena: string): Promise<{ token: string; user: Partial<User> }> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      JWT_SECRET,
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
  }
}
