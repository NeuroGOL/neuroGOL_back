"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (0, express_validator_1.body)('role_id').isInt().withMessage('Debe proporcionar un rol válido'),
    (0, express_validator_1.body)('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest_1.validateRequest
], auth_controller_1.AuthController.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('contrasena').isString().withMessage('Debe ingresar una contraseña'),
    validateRequest_1.validateRequest
], auth_controller_1.AuthController.login);
exports.default = router;
