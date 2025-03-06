import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const router = Router();

router.get('/', RoleController.getAllRoles);
router.get('/:id', param('id').isInt().withMessage(ERROR_MESSAGES.INVALID_ID), validateRequest, RoleController.getRoleById);

router.post(
    '/',
    [
        body('nombre').isString().isLength({ min: 3 }).withMessage(ERROR_MESSAGES.ROLE_NAME_TOO_SHORT),
        validateRequest
    ],
    RoleController.createRole
);

router.put('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

export default router;
