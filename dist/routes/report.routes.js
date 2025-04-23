"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const report_controller_1 = require("../controllers/report.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
/** 🔹 Obtener todos los reportes */
router.get('/', report_controller_1.ReportController.getAllReports);
/** 🔹 Obtener un reporte por ID */
router.get('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, report_controller_1.ReportController.getReportById);
/** 🔹 Crear un nuevo reporte */
router.post('/', [
    (0, express_validator_1.body)('declaration_id').isInt().withMessage('El ID de la declaración debe ser un número entero'),
    (0, express_validator_1.body)('generado_por').isInt().withMessage('El ID del usuario debe ser un número entero'),
], validateRequest_1.validateRequest, report_controller_1.ReportController.generateReport);
/** 🔹 Eliminar un reporte por ID */
router.delete('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, report_controller_1.ReportController.deleteReport);
exports.default = router;
