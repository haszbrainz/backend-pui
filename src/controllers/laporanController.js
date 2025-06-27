// src/controllers/laporanController.js
import * as LaporanService from '../services/laporanService.js';

// --- Fungsi Helper untuk menambahkan host ke imageUrl ---
const addHostToImageUrl = (req, laporan) => {
  if (laporan && laporan.imageUrl) {
    // Pastikan kita tidak menambahkan host jika sudah ada (misalnya dari CDN di masa depan)
    if (laporan.imageUrl.startsWith('/')) {
      const fullImageUrl = `${req.protocol}://${req.get('host')}${laporan.imageUrl}`;
      return { ...laporan, imageUrl: fullImageUrl };
    }
  }
  return laporan; // Kembalikan laporan asli jika tidak ada imageUrl atau sudah lengkap
};
// --- Akhir Fungsi Helper ---


export const createLaporan = async (req, res) => {
  try {
    const laporanData = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : laporanData.imageUrl; // Ambil dari file upload atau body jika ada

    if (!imageUrl) {
        return res.status(400).json({ success: false, error: 'Gambar bukti wajib diunggah atau imageUrl harus ada.' });
    }

    const dataToService = { ...laporanData, imageUrl };
    
    // Panggil service untuk membuat laporan
    const newLaporanFromDb = await LaporanService.createLaporanService(dataToService);

    // Ubah data sebelum mengirim respons
    const newLaporanWithFullUrl = addHostToImageUrl(req, newLaporanFromDb);

    res.status(201).json({ success: true, message: 'Laporan berhasil dibuat.', data: newLaporanWithFullUrl });
  } catch (error) {
    console.error("Controller Error - createLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};

export const getAllLaporan = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) {
        filters.where = { status: req.query.status.toUpperCase() };
    }
    
    const laporanListFromDb = await LaporanService.getAllLaporanService(filters);

    // Ubah setiap item dalam list untuk menambahkan host ke imageUrl
    const laporanListWithFullUrl = laporanListFromDb.map(laporan => addHostToImageUrl(req, laporan));

    res.status(200).json({ success: true, data: laporanListWithFullUrl });
  } catch (error) {
    console.error("Controller Error - getAllLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};

export const getLaporanById = async (req, res) => {
  try {
    const laporanFromDb = await LaporanService.getLaporanByIdService(req.params.id);

    // Ubah data sebelum mengirim respons
    const laporanWithFullUrl = addHostToImageUrl(req, laporanFromDb);

    res.status(200).json({ success: true, data: laporanWithFullUrl });
  } catch (error) {
    console.error("Controller Error - getLaporanById:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Laporan tidak ditemukan atau terjadi kesalahan.' });
  }
};

export const updateLaporan = async (req, res) => {
  try {
    // Di sini juga perlu logika otorisasi, siapa yang boleh update
    const updatedLaporanFromDb = await LaporanService.updateLaporanService(req.params.id, req.body);
    
    // Ubah data sebelum mengirim respons
    const updatedLaporanWithFullUrl = addHostToImageUrl(req, updatedLaporanFromDb);

    res.status(200).json({ success: true, message: 'Laporan berhasil diperbarui.', data: updatedLaporanWithFullUrl });
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
  } catch (error) {
    console.error("Controller Error - deleteLaporan:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};