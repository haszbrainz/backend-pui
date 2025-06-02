// src/controllers/laporanController.js
import * as LaporanService from '../services/laporanService.js';

export const createLaporan = async (req, res) => {
  try {
    // Dalam aplikasi nyata, pelaporId akan diambil dari user yang terautentikasi (misal dari token JWT)
    // Untuk saat ini, kita asumsikan dikirim di body.
    const laporanData = req.body; 
    // if (req.user) { // Contoh jika ada middleware autentikasi yang menempelkan user ke req
    //   laporanData.pelaporId = req.user.id;
    // } else if (!laporanData.pelaporId) {
    //    return res.status(401).json({ success: false, error: 'User tidak terautentikasi atau pelaporId tidak ada.' });
    // }

    const newLaporan = await LaporanService.createLaporanService(laporanData);
    res.status(201).json({ success: true, message: 'Laporan berhasil dibuat.', data: newLaporan });
  } catch (error) {
    console.error("Controller Error - createLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};

export const getAllLaporan = async (req, res) => {
  try {
    // Contoh sederhana untuk filter by status jika dikirim via query param
    // Misalnya: GET /api/laporan?status=BARU
    const filters = {};
    if (req.query.status) {
        filters.where = { status: req.query.status.toUpperCase() }; // Sesuaikan dengan nilai Enum Anda
    }
    // Jika ada query param pelaporId:
    // if (req.query.pelaporId) {
    //     filters.where = { ...filters.where, pelaporId: parseInt(req.query.pelaporId) };
    // }


    const laporanList = await LaporanService.getAllLaporanService(filters);
    res.status(200).json({ success: true, data: laporanList });
  } catch (error) {
    console.error("Controller Error - getAllLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};

export const getLaporanById = async (req, res) => {
  try {
    const laporan = await LaporanService.getLaporanByIdService(req.params.id);
    res.status(200).json({ success: true, data: laporan });
  } catch (error) {
    console.error("Controller Error - getLaporanById:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Laporan tidak ditemukan atau terjadi kesalahan.' });
  }
};

export const updateLaporan = async (req, res) => {
  try {
    // Di sini juga perlu logika otorisasi, siapa yang boleh update
    const updatedLaporan = await LaporanService.updateLaporanService(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Laporan berhasil diperbarui.', data: updatedLaporan });
  } catch (error) {
    console.error("Controller Error - updateLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};

export const deleteLaporan = async (req, res) => {
  try {
    // Di sini juga perlu logika otorisasi
    await LaporanService.deleteLaporanService(req.params.id);
    res.status(200).json({ success: true, message: 'Laporan berhasil dihapus.' });
    // atau res.status(204).send();
  } catch (error) {
    console.error("Controller Error - deleteLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};