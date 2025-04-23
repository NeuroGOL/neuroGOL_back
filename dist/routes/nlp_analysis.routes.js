"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const nlp_analysis_controller_1 = require("../controllers/nlp_analysis.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get('/', nlp_analysis_controller_1.NLPAnalysisController.getAllNLPAnalysis);
router.get('/:id', [(0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero')], validateRequest_1.validateRequest, nlp_analysis_controller_1.NLPAnalysisController.getNLPAnalysisById);
router.post('/', [
    (0, express_validator_1.body)('declaration_id').isInt().withMessage('El ID de la declaración debe ser un número entero'),
    validateRequest_1.validateRequest
], nlp_analysis_controller_1.NLPAnalysisController.createNLPAnalysis);
router.delete('/:id', [(0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero')], validateRequest_1.validateRequest, nlp_analysis_controller_1.NLPAnalysisController.deleteNLPAnalysis);
exports.default = router;
