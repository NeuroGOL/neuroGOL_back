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
exports.PlayerService = void 0;
const db_1 = require("../config/db");
const errorMessages_1 = require("../utils/errorMessages");
class PlayerService {
    /** 🔹 Obtener todos los jugadores */
    static getAllPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT id, nombre, equipo, nacionalidad, profile_picture, created_at FROM player');
                return result.rows;
            }
            catch (error) {
                console.error('Error obteniendo jugadores:', error);
                throw { status: 500, message: errorMessages_1.ERROR_MESSAGES.GET_PLAYERS_ERROR };
            }
        });
    }
    /** 🔹 Obtener un jugador por ID */
    static getPlayerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id)) {
                    throw { status: 400, errors: [{ path: "id", msg: errorMessages_1.ERROR_MESSAGES.INVALID_ID }] };
                }
                const result = yield db_1.pool.query('SELECT id, nombre, equipo, nacionalidad, profile_picture, created_at FROM player WHERE id = $1', [id]);
                if (result.rowCount === 0) {
                    throw { status: 404, message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND };
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error obteniendo jugador por ID:', error);
                throw error.status ? error : { status: 500, message: errorMessages_1.ERROR_MESSAGES.GET_PLAYERS_ERROR };
            }
        });
    }
    /** 🔹 Crear un nuevo jugador */
    static createPlayer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nombre, equipo, nacionalidad, profile_picture }) {
            try {
                const errors = [];
                if (!nombre || nombre.length < 3)
                    errors.push({ path: "nombre", msg: errorMessages_1.ERROR_MESSAGES.NAME_TOO_SHORT });
                if (!equipo || equipo.length < 3)
                    errors.push({ path: "equipo", msg: "El equipo debe tener al menos 3 caracteres" });
                if (!nacionalidad || nacionalidad.length < 3)
                    errors.push({ path: "nacionalidad", msg: "La nacionalidad debe tener al menos 3 caracteres" });
                if (errors.length > 0) {
                    throw { status: 400, errors };
                }
                const result = yield db_1.pool.query(`INSERT INTO player (nombre, equipo, nacionalidad, profile_picture) 
         VALUES ($1, $2, $3, $4) RETURNING id, nombre, equipo, nacionalidad, profile_picture, created_at`, [nombre, equipo, nacionalidad, profile_picture || null]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error creando jugador:', error);
                throw error.status ? error : { status: 500, message: errorMessages_1.ERROR_MESSAGES.CREATE_PLAYER_ERROR };
            }
        });
    }
    /** 🔹 Actualizar un jugador */
    static updatePlayer(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nombre, equipo, nacionalidad, profile_picture }) {
            try {
                if (!id || isNaN(id)) {
                    throw { status: 400, errors: [{ path: "id", msg: errorMessages_1.ERROR_MESSAGES.INVALID_ID }] };
                }
                // Verificar si el jugador existe antes de actualizar
                const playerExists = yield db_1.pool.query('SELECT id FROM player WHERE id = $1', [id]);
                if (playerExists.rowCount === 0) {
                    throw { status: 404, message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND };
                }
                const errors = [];
                if (nombre && nombre.length < 3)
                    errors.push({ path: "nombre", msg: errorMessages_1.ERROR_MESSAGES.NAME_TOO_SHORT });
                if (equipo && equipo.length < 3)
                    errors.push({ path: "equipo", msg: "El equipo debe tener al menos 3 caracteres" });
                if (nacionalidad && nacionalidad.length < 3)
                    errors.push({ path: "nacionalidad", msg: "La nacionalidad debe tener al menos 3 caracteres" });
                if (errors.length > 0) {
                    throw { status: 400, errors };
                }
                const result = yield db_1.pool.query(`UPDATE player 
         SET nombre = COALESCE($1, nombre), 
             equipo = COALESCE($2, equipo), 
             nacionalidad = COALESCE($3, nacionalidad), 
             profile_picture = COALESCE($4, profile_picture)
         WHERE id = $5 
         RETURNING id, nombre, equipo, nacionalidad, profile_picture, created_at`, [nombre, equipo, nacionalidad, profile_picture, id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error actualizando jugador:', error);
                throw error.status ? error : { status: 500, message: errorMessages_1.ERROR_MESSAGES.UPDATE_PLAYER_ERROR };
            }
        });
    }
    /** 🔹 Eliminar un jugador */
    static deletePlayer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id)) {
                    throw { status: 400, errors: [{ path: "id", msg: errorMessages_1.ERROR_MESSAGES.INVALID_ID }] };
                }
                const playerExists = yield db_1.pool.query('SELECT id FROM player WHERE id = $1', [id]);
                if (playerExists.rowCount === 0) {
                    throw { status: 404, message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND };
                }
                const result = yield db_1.pool.query('DELETE FROM player WHERE id = $1 RETURNING id', [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error eliminando jugador:', error);
                throw error.status ? error : { status: 500, message: errorMessages_1.ERROR_MESSAGES.DELETE_PLAYER_ERROR };
            }
        });
    }
}
exports.PlayerService = PlayerService;
