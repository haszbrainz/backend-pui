// src/routes/userRoutes.js
import express from 'express';
import * as UserController from '../controllers/userController.js'; // Path relatif dari src/routes/ ke src/controllers/

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser); // <--- RUTE BARU LOGIN
router.post('/logout', UserController.logoutUser); // <--- RUTE BARU LOGOUT (membutuhkan autentikasi jika ingin tahu siapa yg logout)

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;