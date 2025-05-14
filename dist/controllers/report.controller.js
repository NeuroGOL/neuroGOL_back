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
exports.ReportController = void 0;
const report_service_1 = require("../services/report.service");
const errorMessages_1 = require("../utils/errorMessages");
class ReportController {
    static getAllReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield report_service_1.ReportService.getAllReports();
                res.json(reports);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getReportById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const report = yield report_service_1.ReportService.getReportById(Number(id));
                if (!report) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.REPORT_NOT_FOUND });
                    return;
                }
                res.json(report);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static generateReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { declaration_id, generado_por } = req.body;
                if (!declaration_id || !generado_por) {
                    res.status(400).json({ message: errorMessages_1.ERROR_MESSAGES.MISSING_PARAMETERS });
                    return;
                }
                const newReport = yield report_service_1.ReportService.generateReport(Number(declaration_id), Number(generado_por));
                res.status(201).json(newReport);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield report_service_1.ReportService.deleteReport(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.REPORT_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Reporte eliminado correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ReportController = ReportController;
