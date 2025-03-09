import { pool } from '../config/db';
import { Player } from '../models/player.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class PlayerService {
  static async getAllPlayers(): Promise<Player[]> {
    try {
      const result = await pool.query('SELECT id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at FROM player');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo jugadores:', error);
      throw new Error(ERROR_MESSAGES.GET_PLAYERS_ERROR);
    }
  }

  static async getPlayerById(id: number): Promise<Player | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const result = await pool.query(
        'SELECT id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at FROM player WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo jugador por ID:', error);
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }
  }

  static async createPlayer({
    nombre,
    equipo,
    fecha_nacimiento,
    nacionalidad,
    profile_picture
  }: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    try {
      if (!nombre || nombre.length < 3) throw new Error(ERROR_MESSAGES.NAME_TOO_SHORT);
      if (!equipo || equipo.length < 3) throw new Error(ERROR_MESSAGES.MISSING_FIELDS);
      if (!fecha_nacimiento) throw new Error(ERROR_MESSAGES.INVALID_DATE);
      if (!nacionalidad || nacionalidad.length < 3) throw new Error(ERROR_MESSAGES.MISSING_FIELDS);

      const result = await pool.query(
        `INSERT INTO player (nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture, created_at`,
        [nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture || null]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creando jugador:', error);
      throw new Error(ERROR_MESSAGES.CREATE_PLAYER_ERROR);
    }
  }

  static async updatePlayer(
    id: number,
    { nombre, equipo, fecha_nacimiento, nacionalidad, profile_picture }: Partial<Omit<Player, 'id' | 'created_at'>>
  ): Promise<Player | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // Verificar si el jugador existe antes de actualizar
      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [id]);
      if (playerExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
      }

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
    } catch (error) {
      console.error('Error actualizando jugador:', error);
      throw new Error(ERROR_MESSAGES.UPDATE_PLAYER_ERROR);
    }
  }

  static async deletePlayer(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // Verificar si el jugador existe antes de eliminar
      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [id]);
      if (playerExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
      }

      const result = await pool.query('DELETE FROM player WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando jugador:', error);
      throw new Error(ERROR_MESSAGES.DELETE_PLAYER_ERROR);
    }
  }
}
