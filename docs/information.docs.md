# Information (Approved Reports) Documentation

## Get Approved Reports

Endpoint ini digunakan untuk mengambil daftar laporan yang telah disetujui (APPROVED). Data ini dapat digunakan untuk fitur "Information" atau feed publik bagi pengguna yang telah login.

**URL**: `/api/reports/public/approved`
**Method**: `GET`
**Auth Required**: Yes (Bearer Token)

### Success Response

**Code**: `200 OK`

**Content Example**:

```json
{
    "success": true,
    "data": [
        {
            "id": "60d0fe4f5311236168a109ca",
            "userId": "60d0fe4f5311236168a109cb",
            "fishReferenceId": "60d0fe4f5311236168a109cc",
            "description": "Ditemukan ikan sapu-sapu besar di pinggir sungai.",
            "photoUrl": "http://localhost:3000/uploads/report-123.jpg",
            "latitude": -6.2088,
            "longitude": 106.8456,
            "addressText": "Jl. Sudirman No. 1",
            "status": "APPROVED",
            "adminNote": null,
            "createdAt": "2023-10-27T10:00:00.000Z",
            "updatedAt": "2023-10-27T12:00:00.000Z",
            "fishReference": {
                "id": "60d0fe4f5311236168a109cc",
                "name": "Ikan Sapu-sapu",
                "scientificName": "Pterygoplichthys pardalis",
                "description": "...",
                "imageUrl": "http://localhost:3000/uploads/Asset%201.png",
                "dangerLevel": "MEDIUM",
                "createdAt": "...",
                "updatedAt": "..."
            },
            "user": {
                "id": "60d0fe4f5311236168a109cb",
                "name": "Warga Sungai",
                "avatarUrl": "http://localhost:3000/uploads/user-avatar.jpg"
            }
        }
    ]
}
```

### Notes
- `photoUrl`, `fishReference.imageUrl`, dan `user.avatarUrl` sudah dikonversi menjadi absolute URL (lengkap dengan alamat server).
- Hanya laporan dengan status `APPROVED` yang akan muncul.

---

## Submit New Report

Endpoint ini digunakan oleh user untuk melaporkan penemuan ikan atau kejadian.

**URL**: `/api/reports`
**Method**: `POST`
**Auth Required**: Yes (Bearer Token)
**Content-Type**: `multipart/form-data`

### Body Parameters

| Key | Type | Description |
| :--- | :--- | :--- |
| `photo` | File (Image) | **Required**. Foto bukti laporan. |
| `description` | String | **Required**. Deskripsi laporan / temuan. |
| `latitude` | Number/String | **Required**. Koordinat latitude lokasi. |
| `longitude` | Number/String | **Required**. Koordinat longitude lokasi. |
| `addressText` | String | *Optional*. Alamat teks lokasi (nama jalan / daerah). |
| `fishReferenceId` | String | *Optional*. ID dari referensi ikan jika diketahui. |

### Success Response

**Code**: `201 Created`

**Content Example**:

```json
{
    "success": true,
    "data": {
        "id": "60d0fe4f5311236168a109dd",
        "userId": "60d0fe4f5311236168a109cb",
        "fishReferenceId": null,
        "description": "Ada ikan aneh terdampar",
        "photoUrl": "http://localhost:3000/uploads/file-123.jpg",
        "latitude": -6.200,
        "longitude": 106.800,
        "addressText": "Jl. Kali",
        "status": "PENDING",
        "adminNote": null,
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

### Error Response

**Code**: `400 Bad Request`

**Content Example**:

```json
{
    "success": false,
    "error": "Photo is required"
}
```
