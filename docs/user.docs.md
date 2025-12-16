# User API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### Register
**Endpoint**: `POST /auth/register`
**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "USER" // Optional, default is USER
}
```

### Login
**Endpoint**: `POST /auth/login`
**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbG..." // Gunakan token ini untuk request yang membutuhkan autentikasi
  }
}
```

---

## Articles (Edukasi)

### Get All Articles
**Endpoint**: `GET /articles`
**Description**: Mengambil daftar semua artikel edukasi.

### Get Article By ID
**Endpoint**: `GET /articles/:id`
**Description**: Mengambil detail satu artikel.

---

## Fish References (Ensiklopedia Ikan)

### Get All Fish
**Endpoint**: `GET /fish`
**Description**: Mengambil daftar referensi ikan predator/hama.

### Get Fish By ID
**Endpoint**: `GET /fish/:id`
**Description**: Mengambil detail referensi ikan.

---

## Reports (Pelaporan)

### Create Report
**Endpoint**: `POST /reports`
**Headers**:
- `Authorization`: `Bearer <token>`
- `Content-Type`: `multipart/form-data`

**Body** (Form-Data):
- `photo`: File gambar (Wajib)
- `description`: Text deskripsi laporan (Wajib)
- `latitude`: Koordinat latitude (Wajib, decimal)
- `longitude`: Koordinat longitude (Wajib, decimal)
- `addressText`: Alamat teks (Opsional)
- `fishReferenceId`: ID dari referensi ikan jika diketahui (Opsional)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "PENDING",
    ...
  }
}
```

### Get My Reports
**Endpoint**: `GET /reports/my-reports`
**Headers**:
- `Authorization`: `Bearer <token>`
**Description**: Mengambil daftar laporan yang dibuat oleh user yang sedang login.
