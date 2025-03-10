import { pool } from '../config/db';
import { Player } from '../models/player.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class PlayerService {
  /** 🔹 Obtener todos los jugadores */
  static async getAllPlayers(): Promise<Player[]> {
    try {
      const result = await pool.query('SELECT id, nombre, equipo, nacionalidad, profile_picture, created_at FROM player');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo jugadores:', error);
      throw { status: 500, message: ERROR_MESSAGES.GET_PLAYERS_ERROR };
    }
  }

  /** 🔹 Obtener un jugador por ID */
  static async getPlayerById(id: number): Promise<Player | null> {
    try {
      if (!id || isNaN(id)) {
        throw { status: 400, errors: [{ path: "id", msg: ERROR_MESSAGES.INVALID_ID }] };
      }

      const result = await pool.query(
        'SELECT id, nombre, equipo, nacionalidad, profile_picture, created_at FROM player WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        throw { status: 404, message: ERROR_MESSAGES.PLAYER_NOT_FOUND };
      }

      return result.rows[0];
    } catch (error: any) {
      console.error('Error obteniendo jugador por ID:', error);
      throw error.status ? error : { status: 500, message: ERROR_MESSAGES.GET_PLAYERS_ERROR };
    }
  }

  /** 🔹 Crear un nuevo jugador */
  static async createPlayer({
    nombre,
    equipo,
    nacionalidad,
    profile_picture
  }: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    try {
      const errors: { path: string; msg: string }[] = [];

      if (!nombre || nombre.length < 3) errors.push({ path: "nombre", msg: ERROR_MESSAGES.NAME_TOO_SHORT });
      if (!equipo || equipo.length < 3) errors.push({ path: "equipo", msg: "El equipo debe tener al menos 3 caracteres" });
      if (!nacionalidad || nacionalidad.length < 3) errors.push({ path: "nacionalidad", msg: "La nacionalidad debe tener al menos 3 caracteres" });

      if (errors.length > 0) {
        throw { status: 400, errors };
      }

      const result = await pool.query(
        `INSERT INTO player (nombre, equipo, nacionalidad, profile_picture) 
         VALUES ($1, $2, $3, $4) RETURNING id, nombre, equipo, nacionalidad, profile_picture, created_at`,
        [nombre, equipo, nacionalidad, profile_picture || null]
      );

      return result.rows[0];
    } catch (error: any) {
      console.error('Error creando jugador:', error);
      throw error.status ? error : { status: 500, message: ERROR_MESSAGES.CREATE_PLAYER_ERROR };
    }
  }

  /** 🔹 Actualizar un jugador */
  static async updatePlayer(
    id: number,
    { nombre, equipo, nacionalidad, profile_picture }: Partial<Omit<Player, 'id' | 'created_at'>>
  ): Promise<Player | null> {
    try {
      if (!id || isNaN(id)) {
        throw { status: 400, errors: [{ path: "id", msg: ERROR_MESSAGES.INVALID_ID }] };
      }

      // Verificar si el jugador existe antes de actualizar
      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [id]);
      if (playerExists.rowCount === 0) {
        throw { status: 404, message: ERROR_MESSAGES.PLAYER_NOT_FOUND };
      }

      const errors: { path: string; msg: string }[] = [];

      if (nombre && nombre.length < 3) errors.push({ path: "nombre", msg: ERROR_MESSAGES.NAME_TOO_SHORT });
      if (equipo && equipo.length < 3) errors.push({ path: "equipo", msg: "El equipo debe tener al menos 3 caracteres" });
      if (nacionalidad && nacionalidad.length < 3) errors.push({ path: "nacionalidad", msg: "La nacionalidad debe tener al menos 3 caracteres" });

      if (errors.length > 0) {
        throw { status: 400, errors };
      }

      const result = await pool.query(
        `UPDATE player 
         SET nombre = COALESCE($1, nombre), 
             equipo = COALESCE($2, equipo), 
             nacionalidad = COALESCE($3, nacionalidad), 
             profile_picture = COALESCE($4, profile_picture)
         WHERE id = $5 
         RETURNING id, nombre, equipo, nacionalidad, profile_picture, created_at`,
        [nombre, equipo, nacionalidad, profile_picture, id]
      );

      return result.rows[0] || null;
    } catch (error: any) {
      console.error('Error actualizando jugador:', error);
      throw error.status ? error : { status: 500, message: ERROR_MESSAGES.UPDATE_PLAYER_ERROR };
    }
  }

  /** 🔹 Eliminar un jugador */
  static async deletePlayer(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) {
        throw { status: 400, errors: [{ path: "id", msg: ERROR_MESSAGES.INVALID_ID }] };
      }

      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [id]);
      if (playerExists.rowCount === 0) {
        throw { status: 404, message: ERROR_MESSAGES.PLAYER_NOT_FOUND };
      }

      const result = await pool.query('DELETE FROM player WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error: any) {
      console.error('Error eliminando jugador:', error);
      throw error.status ? error : { status: 500, message: ERROR_MESSAGES.DELETE_PLAYER_ERROR };
    }
  }
}
