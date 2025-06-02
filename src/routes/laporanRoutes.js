// src/routes/laporanRoutes.js
import express from 'express';
import * as LaporanController from '../controllers/laporanController.js';
// import { authenticateTokenMiddleware } from '../middleware/authMiddleware.js'; // Contoh jika ada middleware auth

const router = express.Router();

// Create Laporan - Mungkin perlu autentikasi
router.post('/', /* authenticateTokenMiddleware, */ LaporanController.createLaporan);

// Get All Laporan
router.get('/', LaporanController.getAllLaporan);

// Get Laporan by ID
router.get('/:id', LaporanController.getLaporanById);

// Update Laporan - Perlu autentikasi & otorisasi
router.put('/:id', /* authenticateTokenMiddleware, */ LaporanController.updateLaporan);

// Delete Laporan - Perlu autentikasi & otorisasi (misal, admin only)
router.delete('/:id', /* authenticateTokenMiddleware, */ LaporanController.deleteLaporan);

export default router;