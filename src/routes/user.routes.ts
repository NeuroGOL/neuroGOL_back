import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
    '/',
    [
        body('nombre').isString().isLength({ min: 3 }),
        body('email').isEmail(),
        body('contrasena').isLength({ min: 6 }),
        body('role_id').isInt().withMessage('El role_id debe ser un número válido'),
        body('profile_picture').optional().isURL().withMessage('Debe ser una URL válida'),
        validateRequest
    ],
    UserController.createUser
);

router.put('/:id', UserController.updateUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.delete('/:id', UserController.deleteUser);

export default router;
