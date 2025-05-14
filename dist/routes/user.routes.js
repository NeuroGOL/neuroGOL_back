"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.UserController.getAllUsers);
router.get('/:id', [(0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero')], validateRequest_1.validateRequest, user_controller_1.UserController.getUserById);
router.post('/', [
    (0, express_validator_1.body)('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (0, express_validator_1.body)('role_id').isInt().withMessage('Rol inválido'),
    (0, express_validator_1.body)('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest_1.validateRequest
], user_controller_1.UserController.createUser);
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'),
    (0, express_validator_1.body)('nombre').optional().isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('contrasena').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (0, express_validator_1.body)('role_id').optional().isInt().withMessage('Rol inválido'),
    (0, express_validator_1.body)('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest_1.validateRequest
], user_controller_1.UserController.updateUser);
router.delete('/:id', [(0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero')], validateRequest_1.validateRequest, user_controller_1.UserController.deleteUser);
exports.default = router;
