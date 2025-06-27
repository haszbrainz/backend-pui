// src/routes/laporanRoutes.js
import express from 'express';
import * as LaporanController from '../controllers/laporanController.js';
import upload from '../middleware/uploadMiddleware.js'; // <-- IMPOR BARU

const router = express.Router();

// Gunakan middleware upload.single('imageUrl') pada rute POST
// 'imageUrl' adalah nama field yang akan dikirim dari Postman/Flutter
router.post('/', upload.single('imageUrl'), LaporanController.createLaporan); // <-- PERUBAHAN DI SINI

// Rute lainnya tetap sama
router.get('/', LaporanController.getAllLaporan);
router.get('/:id', LaporanController.getLaporanById);
router.put('/:id', LaporanController.updateLaporan);
router.delete('/:id', LaporanController.deleteLaporan);

export default router;