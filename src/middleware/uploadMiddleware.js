// src/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  // Tentukan folder tujuan untuk menyimpan file
  destination: function (req, file, cb) {
    // Pastikan folder ini ada. Buat secara manual jika perlu.
    cb(null, 'public/uploads/'); 
  },
  // Buat nama file yang unik untuk menghindari konflik
  filename: function (req, file, cb) {
    // Contoh: namafile-timestamp.ekstensi
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file untuk hanya menerima tipe gambar tertentu
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true); // Terima file
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, JPG) yang diizinkan!'), false); // Tolak file
  }
};

// Inisialisasi Multer dengan konfigurasi di atas
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Batas ukuran file 5 MB
  },
  fileFilter: fileFilter
});

export default upload;