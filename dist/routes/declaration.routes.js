"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const declaration_controller_1 = require("../controllers/declaration.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get('/', declaration_controller_1.DeclarationController.getAllDeclarations);
router.get('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, declaration_controller_1.DeclarationController.getDeclarationById);
router.post('/', [
    (0, express_validator_1.body)('player_id').isInt().withMessage('El ID del jugador debe ser un número entero'),
    (0, express_validator_1.body)('user_id').isInt().withMessage('El ID del usuario debe ser un número entero'),
    (0, express_validator_1.body)('categoria_texto').isString().isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('fuente').isString().isLength({ min: 3 }).withMessage('La fuente debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('texto').isString().isLength({ min: 5 }).withMessage('El texto debe tener al menos 5 caracteres'),
    validateRequest_1.validateRequest
], declaration_controller_1.DeclarationController.createDeclaration);
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'),
    (0, express_validator_1.body)('categoria_texto').optional().isString().isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('fuente').optional().isString().isLength({ min: 3 }).withMessage('La fuente debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('texto').optional().isString().isLength({ min: 5 }).withMessage('El texto debe tener al menos 5 caracteres'),
    validateRequest_1.validateRequest
], declaration_controller_1.DeclarationController.updateDeclaration);
router.delete('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, declaration_controller_1.DeclarationController.deleteDeclaration);
exports.default = router;
