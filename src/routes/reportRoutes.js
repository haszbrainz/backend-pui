import express from 'express';
import * as ReportController from '../controllers/reportController.js';
import upload from '../middleware/uploadMiddleware.js'; // Assuming this exists based on previous list
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('photo'), ReportController.createReport);
router.get('/my-reports', authenticateToken, ReportController.getMyReports);
router.get('/public/approved', authenticateToken, ReportController.getApprovedReports);

export default router;
