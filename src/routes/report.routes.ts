import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';

const router = Router();

router.get('/', ReportController.getAllReports);
router.get('/:id', ReportController.getReportById);
router.post('/', ReportController.generateReport);
router.delete('/:id', ReportController.deleteReport);

export default router;
