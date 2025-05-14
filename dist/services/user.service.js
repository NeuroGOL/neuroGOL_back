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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorMessages_1 = require("../utils/errorMessages");
class UserService {
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT id, nombre, email, role_id, profile_picture, created_at FROM users');
                return result.rows;
            }
            catch (error) {
                console.error('Error obteniendo usuarios:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.GET_USERS_ERROR);
            }
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const result = yield db_1.pool.query('SELECT id, nombre, email, role_id, profile_picture, created_at FROM users WHERE id = $1', [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error obteniendo usuario por ID:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND);
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !email.includes('@'))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_EMAIL);
                const result = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error obteniendo usuario por email:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.GET_USERS_ERROR);
            }
        });
    }
    static createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nombre, email, contrasena, role_id, profile_picture }) {
            try {
                if (!nombre || nombre.length < 3)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.NAME_TOO_SHORT);
                if (!email || !email.includes('@'))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_EMAIL);
                if (!contrasena || contrasena.length < 6)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.PASSWORD_TOO_SHORT);
                if (!role_id || isNaN(role_id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ROLE);
                // Verificar si el email ya está en uso
                const existingUser = yield db_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
                if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
                }
                // Hashear la contraseña antes de guardarla
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                const result = yield db_1.pool.query(`INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, role_id, profile_picture, created_at`, [nombre, email, hashedPassword, role_id, profile_picture || null]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error creando usuario:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.CREATE_USER_ERROR);
            }
        });
    }
    static updateUser(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nombre, email, contrasena, role_id, profile_picture }) {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                // Verificar si el usuario existe antes de actualizar
                const userExists = yield db_1.pool.query('SELECT id FROM users WHERE id = $1', [id]);
                if (userExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                }
                // Validaciones opcionales
                if (nombre && nombre.length < 3)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.NAME_TOO_SHORT);
                if (email && !email.includes('@'))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_EMAIL);
                if (contrasena && contrasena.length < 6)
                    throw new Error(errorMessages_1.ERROR_MESSAGES.PASSWORD_TOO_SHORT);
                if (role_id && isNaN(role_id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ROLE);
                const hashedPassword = contrasena ? yield bcryptjs_1.default.hash(contrasena, 10) : undefined;
                const result = yield db_1.pool.query(`UPDATE users 
         SET nombre = COALESCE($1, nombre), 
             email = COALESCE($2, email), 
             contrasena = COALESCE($3, contrasena), 
             role_id = COALESCE($4, role_id), 
             profile_picture = COALESCE($5, profile_picture)
         WHERE id = $6 
         RETURNING id, nombre, email, role_id, profile_picture, created_at`, [nombre, email, hashedPassword, role_id, profile_picture, id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error actualizando usuario:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.UPDATE_USER_ERROR);
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                // Verificar si el usuario existe antes de eliminar
                const userExists = yield db_1.pool.query('SELECT id FROM users WHERE id = $1', [id]);
                if (userExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                }
                const result = yield db_1.pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error eliminando usuario:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.DELETE_USER_ERROR);
            }
        });
    }
}
exports.UserService = UserService;
