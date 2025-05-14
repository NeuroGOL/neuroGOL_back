"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const player_controller_1 = require("../controllers/player.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get('/', player_controller_1.PlayerController.getAllPlayers);
router.get('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, player_controller_1.PlayerController.getPlayerById);
router.post('/', [
    (0, express_validator_1.body)('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('equipo').isString().isLength({ min: 3 }).withMessage('El equipo debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('nacionalidad').isString().isLength({ min: 3 }).withMessage('La nacionalidad debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest_1.validateRequest
], player_controller_1.PlayerController.createPlayer);
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'),
    (0, express_validator_1.body)('nombre').optional().isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('equipo').optional().isString().isLength({ min: 3 }).withMessage('El equipo debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('nacionalidad').optional().isString().isLength({ min: 3 }).withMessage('La nacionalidad debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
    validateRequest_1.validateRequest
], player_controller_1.PlayerController.updatePlayer);
router.delete('/:id', (0, express_validator_1.param)('id').isInt().withMessage('El ID debe ser un número entero'), validateRequest_1.validateRequest, player_controller_1.PlayerController.deletePlayer);
exports.default = router;
