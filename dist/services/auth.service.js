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
exports.AuthService = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMessages_1 = require("../utils/errorMessages");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not defined');
class AuthService {
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nombre, email, contrasena, role_id, profile_picture }) {
            try {
                const existingUser = yield db_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
                if (existingUser.rowCount && existingUser.rowCount > 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
                }
                if (!contrasena) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.PASSWORD_REQUIRED);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                yield db_1.pool.query(`INSERT INTO users (nombre, email, contrasena, role_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5)`, [nombre, email, hashedPassword, role_id, profile_picture || null]);
                return { message: 'Usuario registrado exitosamente' };
            }
            catch (error) {
                console.error(error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.REGISTRATION_ERROR);
            }
        });
    }
    static login(email, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (result.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
                }
                const user = result.rows[0];
                const isMatch = yield bcryptjs_1.default.compare(contrasena, user.contrasena);
                if (!isMatch) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role_id: user.role_id }, JWT_SECRET, { expiresIn: '24h' });
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
            catch (error) {
                console.error(error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.LOGIN_ERROR);
            }
        });
    }
}
exports.AuthService = AuthService;
