// src/controllers/userController.js
import * as UserService from '../services/userService.js'; // Path relatif dari src/controllers/ ke src/services/
import jwt from 'jsonwebtoken';
// ... (semua fungsi controller Anda: registerUser, getAllUsers, dll.)
// Logika internal fungsi-fungsi ini tetap sama.
// Contoh:
export const registerUser = async (req, res) => {
  try {
    const newUser = await UserService.createUserService(req.body);
    res.status(201).json({ success: true, message: 'User berhasil dibuat.', data: newUser });
  } catch (error) {
    console.error("Controller Error - registerUser:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};
export const getAllUsers = async (req, res) => { /* ... kode Anda ... */ 
    try {
        const users = await UserService.getAllUsersService();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.error("Controller Error - getAllUsers:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
      }
};
export const getUserById = async (req, res) => { /* ... kode Anda ... */ 
    try {
        const user = await UserService.getUserByIdService(req.params.id);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.error("Controller Error - getUserById:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'User tidak ditemukan atau terjadi kesalahan.' });
      }
};
export const updateUser = async (req, res) => { /* ... kode Anda ... */ 
    try {
        const updatedUser = await UserService.updateUserService(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'User berhasil diperbarui.', data: updatedUser });
      } catch (error) {
        console.error("Controller Error - updateUser:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
      }
};
export const deleteUser = async (req, res) => { /* ... kode Anda ... */ 
    try {
        await UserService.deleteUserService(req.params.id);
        res.status(200).json({ success: true, message: 'User berhasil dihapus.' });
      } catch (error) {
        console.error("Controller Error - deleteUser:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
      }
};


// --- KONTROLER BARU UNTUK LOGIN ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.loginUserService(email, password);

    // Buat JWT Token
    // Pastikan JWT_SECRET sudah diatur di file .env Anda
    // dan Node.js bisa mengakses environment variables (biasanya perlu paket dotenv jika tidak otomatis)
    // Jika menjalankan dengan nodemon, Anda bisa menggunakan `nodemon -r dotenv/config index.js`
    // atau muat dotenv di awal file index.js: import 'dotenv/config';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Ambil dari environment variable
      { expiresIn: '1h' } // Token berlaku selama 1 jam (contoh)
    );
    
    // Untuk mengambil data user tanpa password untuk respons (jika service tidak melakukannya)
    // Kita sudah melakukannya di service, jadi user di sini sudah tanpa password.
    // const { password: _, ...userPublicData } = user;


    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        user, // User data tanpa password dari service
        token,
      },
    });
  } catch (error) {
    console.error("Controller Error - loginUser:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};
// --- AKHIR KONTROLER LOGIN ---


// --- KONTROLER BARU UNTUK LOGOUT ---
export const logoutUser = async (req, res) => {
  // Untuk JWT stateless, logout utama terjadi di sisi client (hapus token).
  // Endpoint ini bisa ada untuk tujuan logging, atau jika Anda mengimplementasikan
  // token blocklist/denylist di masa depan.
  // Untuk saat ini, kita hanya kirim respons sukses.
  
  // Contoh: Jika Anda ingin mendapatkan userId dari token yang (mungkin) dikirim
  // const token = req.headers.authorization?.split(' ')[1];
  // if (token) {
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     console.log(`User ${decoded.userId} melakukan logout.`);
  //   } catch (err) {
  //     // Token tidak valid atau sudah expired, tidak masalah untuk logout
  //     console.log('Logout dengan token tidak valid atau expired.');
  //   }
  // }

  res.status(200).json({ success: true, message: 'Logout berhasil.' });
};
// --- AKHIR KONTROLER LOGOUT ---