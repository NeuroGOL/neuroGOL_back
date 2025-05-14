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
exports.RoleService = void 0;
const db_1 = require("../config/db");
class RoleService {
    static getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.pool.query('SELECT * FROM role ORDER BY id ASC');
            return result.rows;
        });
    }
    static getRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.pool.query('SELECT * FROM role WHERE id = $1', [id]);
            return result.rows[0] || null;
        });
    }
    static createRole(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nombre }) {
            const result = yield db_1.pool.query(`INSERT INTO role (nombre) 
       VALUES ($1) RETURNING *`, [nombre]);
            return result.rows[0];
        });
    }
    static updateRole(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nombre }) {
            const result = yield db_1.pool.query(`UPDATE role 
       SET nombre = COALESCE($1, nombre) 
       WHERE id = $2 
       RETURNING *`, [nombre, id]);
            return result.rows[0] || null;
        });
    }
    static deleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.pool.query('DELETE FROM role WHERE id = $1 RETURNING id', [id]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
}
exports.RoleService = RoleService;
