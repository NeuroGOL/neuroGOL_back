import { pool } from '../config/db';
import { Player } from '../models/player.model';

export class PlayerService {
  static async getAllPlayers(): Promise<Player[]> {
    const result = await pool.query('SELECT id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at FROM player');
    return result.rows;
  }

  static async getPlayerById(id: number): Promise<Player | null> {
    const result = await pool.query('SELECT id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at FROM player WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async createPlayer({ nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture }: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    const result = await pool.query(
      `INSERT INTO player (nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at`,
      [nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture || null]
    );

    return result.rows[0];
  }

  static async updatePlayer(id: number, { nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture }: Partial<Omit<Player, 'id' | 'created_at'>>): Promise<Player | null> {
    const result = await pool.query(
      `UPDATE player 
       SET nombre = COALESCE($1, nombre), 
           equipo = COALESCE($2, equipo), 
           fecha_nacimiento = COALESCE($3, fecha_nacimiento), 
           nacionalidad = COALESCE($4, nacionalidad), 
           profile_picture = COALESCE($5, profile_picture)
       WHERE id = $6 
       RETURNING id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at`,
      [nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, id]
    );

    return result.rows[0] || null;
  }

  static async deletePlayer(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM player WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
