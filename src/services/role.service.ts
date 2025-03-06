import { pool } from '../config/db';
import { Role } from '../models/role.model';

export class RoleService {
  static async getAllRoles(): Promise<Role[]> {
    const result = await pool.query('SELECT * FROM roles ORDER BY id ASC');
    return result.rows;
  }

  static async getRoleById(id: number): Promise<Role | null> {
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createRole(nombre: string): Promise<Role> {
    const result = await pool.query(
      'INSERT INTO roles (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  }

  static async updateRole(id: number, nombre: string): Promise<Role | null> {
    const result = await pool.query(
      'UPDATE roles SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );
    return result.rows[0] || null;
  }

  static async deleteRole(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
