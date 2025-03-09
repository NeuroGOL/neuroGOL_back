import { pool } from '../config/db';
import { Declaration } from '../models/declaration.model';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class DeclarationService {
  static async getAllDeclarations(): Promise<Declaration[]> {
    try {
      const result = await pool.query('SELECT * FROM declarations ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo declaraciones:', error);
      throw new Error(ERROR_MESSAGES.GET_DECLARATIONS_ERROR);
    }
  }

  static async getDeclarationById(id: number): Promise<Declaration | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      const result = await pool.query('SELECT * FROM declarations WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo declaración por ID:', error);
      throw new Error(ERROR_MESSAGES.DECLARATION_NOT_FOUND);
    }
  }

  static async createDeclaration({
    player_id,
    user_id,
    categoria_texto,
    fuente,
    texto
  }: Omit<Declaration, 'id' | 'created_at'>): Promise<Declaration> {
    try {
      if (!player_id || isNaN(player_id)) throw new Error(ERROR_MESSAGES.INVALID_ID);
      if (!user_id || isNaN(user_id)) throw new Error(ERROR_MESSAGES.INVALID_ID);
      if (!categoria_texto || categoria_texto.length < 3) throw new Error(ERROR_MESSAGES.MISSING_FIELDS);
      if (!fuente || fuente.length < 3) throw new Error(ERROR_MESSAGES.MISSING_FIELDS);
      if (!texto || texto.length < 5) throw new Error(ERROR_MESSAGES.MISSING_FIELDS);

      // 🔹 Verificar si el jugador existe
      const playerExists = await pool.query('SELECT id FROM player WHERE id = $1', [player_id]);
      if (playerExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
      }

      // 🔹 Verificar si el usuario (analista) existe
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const result = await pool.query(
        `INSERT INTO declarations (player_id, user_id, categoria_texto, fuente, texto) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [player_id, user_id, categoria_texto, fuente, texto]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creando declaración:', error);
      throw new Error(ERROR_MESSAGES.CREATE_DECLARATION_ERROR);
    }
  }

  static async updateDeclaration(
    id: number,
    { categoria_texto, fuente, texto }: Partial<Omit<Declaration, 'id' | 'player_id' | 'user_id' | 'created_at'>>
  ): Promise<Declaration | null> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // 🔹 Verificar si la declaración existe antes de actualizar
      const declarationExists = await pool.query('SELECT id FROM declarations WHERE id = $1', [id]);
      if (declarationExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.DECLARATION_NOT_FOUND);
      }

      const result = await pool.query(
        `UPDATE declarations 
         SET categoria_texto = COALESCE($1, categoria_texto), 
             fuente = COALESCE($2, fuente),
             texto = COALESCE($3, texto)
         WHERE id = $4 
         RETURNING *`,
        [categoria_texto, fuente, texto, id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error actualizando declaración:', error);
      throw new Error(ERROR_MESSAGES.UPDATE_DECLARATION_ERROR);
    }
  }

  static async deleteDeclaration(id: number): Promise<boolean> {
    try {
      if (!id || isNaN(id)) throw new Error(ERROR_MESSAGES.INVALID_ID);

      // 🔹 Verificar si la declaración existe antes de eliminar
      const declarationExists = await pool.query('SELECT id FROM declarations WHERE id = $1', [id]);
      if (declarationExists.rowCount === 0) {
        throw new Error(ERROR_MESSAGES.DECLARATION_NOT_FOUND);
      }

      const result = await pool.query('DELETE FROM declarations WHERE id = $1 RETURNING id', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando declaración:', error);
      throw new Error(ERROR_MESSAGES.DELETE_DECLARATION_ERROR);
    }
  }
}
