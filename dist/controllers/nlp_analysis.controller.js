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
exports.NLPAnalysisController = void 0;
const nlp_analysis_service_1 = require("../services/nlp_analysis.service");
const errorMessages_1 = require("../utils/errorMessages");
class NLPAnalysisController {
    static getAllNLPAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analysis = yield nlp_analysis_service_1.NLPAnalysisService.getAllNLPAnalysis();
                res.json(analysis);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getNLPAnalysisById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const analysis = yield nlp_analysis_service_1.NLPAnalysisService.getNLPAnalysisById(Number(id));
                if (!analysis) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.NLP_ANALYSIS_NOT_FOUND });
                    return;
                }
                res.json(analysis);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createNLPAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("📥 Datos recibidos en el backend:", req.body);
                const { declaration_id } = req.body;
                if (!declaration_id || isNaN(Number(declaration_id))) {
                    console.error("❌ Error: ID inválido:", declaration_id);
                    res.status(400).json({ message: errorMessages_1.ERROR_MESSAGES.INVALID_ID });
                    return;
                }
                const newAnalysis = yield nlp_analysis_service_1.NLPAnalysisService.createNLPAnalysis(declaration_id);
                res.status(201).json(newAnalysis); // ✅ Asegurar que `res.json()` es el único return
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteNLPAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield nlp_analysis_service_1.NLPAnalysisService.deleteNLPAnalysis(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.NLP_ANALYSIS_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Análisis NLP eliminado correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.NLPAnalysisController = NLPAnalysisController;
