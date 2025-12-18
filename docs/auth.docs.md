# Authentication Module Documentation

## Overview
Modul ini menangani proses otentikasi pengguna, termasuk registrasi dan login. Modul ini menggunakan JWT (JSON Web Token) untuk keamanan sesi.

## Base URL
\`/api/auth\`

## Endpoints

### 1. Register User
Mendaftarkan pengguna baru ke dalam sistem.

- **URL**: \`/register\`
- **Method**: \`POST\`
- **Content-Type**: \`application/json\`

#### Request Body
| Field | Tipe Data | Wajib | Deskripsi |
|-------|-----------|-------|-----------|
| \`email\` | String | Ya | Alamat email pengguna (harus unik). |
| \`password\` | String | Ya | Kata sandi pengguna. |
| \`name\` | String | Tidak | Nama lengkap pengguna. |
| \`alamatLengkap\`| String | Tidak | Alamat lengkap user. |
| \`role\` | String | Tidak | Peran pengguna. Default: \`USER\`. |

#### Response Success (201 Created)
```json
{
  "success": true,
  "message": "User berhasil dibuat.",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "alamatLengkap": "Jl. Contoh No. 123",
    "role": "USER",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
}
```

#### Response Error (400 Bad Request)
Jika email sudah terdaftar:
```json
{
  "success": false,
  "error": "Email sudah terdaftar (P2002)."
}
```

---

### 2. Login User
Melakukan login dan mendapatkan token akses (JWT).

- **URL**: \`/login\`
- **Method**: \`POST\`
- **Content-Type**: \`application/json\`

#### Request Body
| Field | Tipe Data | Wajib | Deskripsi |
|-------|-----------|-------|-----------|
| \`email\` | String | Ya | Email yang terdaftar. |
| \`password\` | String | Ya | Kata sandi. |

#### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "alamatLengkap": "Jl. Contoh No. 123",
      "role": "USER",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    },
    "token": "eyJh... (JWT Token)"
  }
}
```

#### Response Error (401 Unauthorized)
Jika email atau password salah:
```json
{
  "success": false,
  "error": "Email atau password salah."
}
```

## Middleware

### 1. `authenticateToken`
Middleware ini digunakan untuk memverifikasi validitas token JWT pada header request.
- **Lokasi**: `src/middleware/authMiddleware.js`
- **Header Required**: `Authorization: Bearer <token>`
- **Prilaku**:
  - Jika token valid: Menambahkan objek user ke `req.user` dan melanjutkan ke handler berikutnya.
  - Jika token tidak ada: Mengembalikan 401 Unauthorized.
  - Jika token tidak valid: Mengembalikan 403 Forbidden.

### 2. `authorizeAdmin`
Middleware ini memastikan bahwa pengguna yang sedang login memiliki role `ADMIN`.
- **Lokasi**: `src/middleware/authMiddleware.js`
- **Prasarat**: Harus digunakan setelah `authenticateToken`.
- **Prilaku**:
  - Jika role user adalah ADMIN: Melanjutkan proses.
  - Jika bukan: Mengembalikan 403 Forbidden.

## File Structure
- **Controller**: `src/controllers/authController.js` (Menangani logic request/response)
- **Service**: `src/services/authService.js` (Menangani business logic dan database)
- **Routes**: `src/routes/authRoutes.js` (Definisi endpoint)
- **Middleware**: `src/middleware/authMiddleware.js` (Proteksi route)
