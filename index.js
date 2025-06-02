import 'dotenv/config';
// src/index.js
import express from 'express';
import userRoutes from './src/routes/userRoutes.js'; // Path relatif dari src/ ke src/routes/
// import laporanRoutes from './routes/laporanRoutes.js'; // Jika Anda memindahkan rute laporan juga

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
// app.use('/api/laporan', laporanRoutes); // Daftarkan rute laporan jika sudah dipindah

app.get('/', (req, res) => {
  res.send('Selamat datang di Backend PUI App!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} diterima, menutup server...`);
    // Pastikan prisma diimpor dan digunakan dengan benar di sini jika $disconnect dipanggil
    await prisma.$disconnect();
    console.log('Koneksi Prisma ditutup.');
    process.exit(0);
  });
});