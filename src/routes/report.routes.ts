import { Router } from 'express';
import { body, param } from 'express-validator';
import { ReportController } from '../controllers/report.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

/** 🔹 Obtener todos los reportes */
router.get('/', ReportController.getAllReports);

/** 🔹 Obtener un reporte por ID */
router.get(
  '/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validateRequest,
  ReportController.getReportById
);

/** 🔹 Crear un nuevo reporte */
router.post(
  '/',
  [
    body('declaration_id').isInt().withMessage('El ID de la declaración debe ser un número entero'),
    body('generado_por').isInt().withMessage('El ID del usuario debe ser un número entero'),
  ],
  validateRequest,
  ReportController.generateReport
);

/** 🔹 Eliminar un reporte por ID */
router.delete(
  '/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validateRequest,
  ReportController.deleteReport
);

export default router;
