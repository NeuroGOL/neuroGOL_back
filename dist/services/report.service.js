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
exports.ReportService = void 0;
const db_1 = require("../config/db");
const errorMessages_1 = require("../utils/errorMessages");
class ReportService {
    static getAllReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.pool.query('SELECT * FROM reports ORDER BY created_at DESC');
                return result.rows;
            }
            catch (error) {
                console.error('Error obteniendo reportes:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.GET_REPORTS_ERROR);
            }
        });
    }
    static getReportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const result = yield db_1.pool.query('SELECT * FROM reports WHERE id = $1', [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error('Error obteniendo reporte por ID:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.REPORT_NOT_FOUND);
            }
        });
    }
    static generateReport(declaration_id, generado_por) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!declaration_id || isNaN(declaration_id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                if (!generado_por || isNaN(generado_por))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                // 🔹 Verificar si la declaración existe y obtener player_id
                const declarationResult = yield db_1.pool.query('SELECT player_id FROM declarations WHERE id = $1', [declaration_id]);
                if (declarationResult.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND);
                }
                const player_id = declarationResult.rows[0].player_id;
                // 🔹 Verificar si el usuario (analista) existe
                const userExists = yield db_1.pool.query('SELECT id FROM users WHERE id = $1', [generado_por]);
                if (userExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                }
                // 🔹 Obtener el análisis NLP más reciente basado en `declaration_id`
                const nlpResult = yield db_1.pool.query(`SELECT id FROM nlp_analysis WHERE declaration_id = $1 ORDER BY created_at DESC LIMIT 1`, [declaration_id]);
                if (nlpResult.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.NLP_NOT_FOUND);
                }
                const nlpAnalysis = nlpResult.rows[0];
                // 🔹 Insertar el reporte en la base de datos
                const result = yield db_1.pool.query(`INSERT INTO reports (player_id, declaration_id, nlp_analysis_id, generado_por)
         VALUES ($1, $2, $3, $4) RETURNING *`, [player_id, declaration_id, nlpAnalysis.id, generado_por]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error generando reporte:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.CREATE_REPORT_ERROR);
            }
        });
    }
    static deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || isNaN(id))
                    throw new Error(errorMessages_1.ERROR_MESSAGES.INVALID_ID);
                const reportExists = yield db_1.pool.query('SELECT id FROM reports WHERE id = $1', [id]);
                if (reportExists.rowCount === 0) {
                    throw new Error(errorMessages_1.ERROR_MESSAGES.REPORT_NOT_FOUND);
                }
                const result = yield db_1.pool.query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error eliminando reporte:', error);
                throw new Error(errorMessages_1.ERROR_MESSAGES.DELETE_REPORT_ERROR);
            }
        });
    }
}
exports.ReportService = ReportService;
