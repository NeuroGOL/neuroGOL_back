import { body } from 'express-validator';

export const registerValidation = [
    body('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('contrasena').isString().withMessage('Debe ingresar una contraseña'),
];
