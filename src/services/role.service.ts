import { pool } from '../config/db';
import { Role } from '../models/role.model';

export class RoleService {
  static async getAllRoles(): Promise<Role[]> {
    const result = await pool.query('SELECT * FROM role ORDER BY id ASC');
    return result.rows;
  }

  static async getRoleById(id: number): Promise<Role | null> {
    const result = await pool.query('SELECT * FROM role WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createRole({ nombre }: Omit<Role, 'id'>): Promise<Role> {
    const result = await pool.query(
      `INSERT INTO role (nombre) 
       VALUES ($1) RETURNING *`,
      [nombre]
    );
    return result.rows[0];
  }

  static async updateRole(id: number, { nombre }: Partial<Omit<Role, 'id'>>): Promise<Role | null> {
    const result = await pool.query(
      `UPDATE role 
       SET nombre = COALESCE($1, nombre) 
       WHERE id = $2 
       RETURNING *`,
      [nombre, id]
    );
    return result.rows[0] || null;
  }

  static async deleteRole(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM role WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
