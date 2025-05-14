"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationService = void 0;
const db_1 = require("../config/db");
const errorMessages_1 = require("../utils/errorMessages");
class DeclarationService {
    static getAllDeclarations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT * FROM declarations ORDER BY created_at DESC');
                return result.rows;
            }
            catch (error) {
                console.error('Error obteniendo declaraciones:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.GET_DECLARATIONS_ERROR);
            }
        });
    }
    static getDeclarationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const result = yield db_1.pool.query('SELECT * FROM declarations WHERE id = $1', [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error obteniendo declaración por ID:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND);
            }
        });
    }
    static createDeclaration(_a) {
        return __awaiter(this, arguments, void 0, function* ({ player_id, user_id, categoria_texto, fuente, texto }) {
            try {
                if (!player_id || isNaN(player_id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                if (!user_id || isNaN(user_id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                if (!categoria_texto || categoria_texto.length < 3)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.MISSING_FIELDS);
                if (!fuente || fuente.length < 3)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.MISSING_FIELDS);
                if (!texto || texto.length < 5)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.MISSING_FIELDS);
                // 🔹 Verificar si el jugador existe
                const playerExists = yield db_1.pool.query('SELECT id FROM player WHERE id = $1', [player_id]);
                if (playerExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND);
                }
                // 🔹 Verificar si el usuario (analista) existe
                const userExists = yield db_1.pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
                if (userExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                }
                const result = yield db_1.pool.query(`INSERT INTO declarations (player_id, user_id, categoria_texto, fuente, texto) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [player_id, user_id, categoria_texto, fuente, texto]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error creando declaración:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.CREATE_DECLARATION_ERROR);
            }
        });
    }
    static updateDeclaration(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { categoria_texto, fuente, texto }) {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                // 🔹 Verificar si la declaración existe antes de actualizar
                const declarationExists = yield db_1.pool.query('SELECT id FROM declarations WHERE id = $1', [id]);
                if (declarationExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND);
                }
                const result = yield db_1.pool.query(`UPDATE declarations 
         SET categoria_texto = COALESCE($1, categoria_texto), 
             fuente = COALESCE($2, fuente),
             texto = COALESCE($3, texto)
         WHERE id = $4 
         RETURNING *`, [categoria_texto, fuente, texto, id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error actualizando declaración:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.UPDATE_DECLARATION_ERROR);
            }
        });
    }
    static deleteDeclaration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                // 🔹 Verificar si la declaración existe antes de eliminar
                const declarationExists = yield db_1.pool.query('SELECT id FROM declarations WHERE id = $1', [id]);
                if (declarationExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND);
                }
                const result = yield db_1.pool.query('DELETE FROM declarations WHERE id = $1 RETURNING id', [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error eliminando declaración:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.DELETE_DECLARATION_ERROR);
            }
        });
    }
}
exports.DeclarationService = DeclarationService;
