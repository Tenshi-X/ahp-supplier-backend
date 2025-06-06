
# 📦 AHP-Supply REST API Documentation

Sistem ini menyediakan API untuk manajemen supplier, penilaian kriteria, pencatatan kebutuhan supply, serta autentikasi pengguna.

---

## 🔐 Authentication

### `POST /api/auth/login`
Login pengguna.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```

---

### `POST /api/auth/register`
Registrasi pengguna baru.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123",
  "email": "user1@example.com",
  "role": "staff"
}
```

---

### `POST /api/auth/logout`
Logout pengguna (menghapus sesi di sisi client).

---

## 🧾 Supplier Management

### `POST /api/supplier`
**Role**: `staff`  
Menambahkan data supplier baru.

**Request Body:**
```json
{
  "nama": "PT Maju Jaya",
  "alamat": "Jl. Mawar No.1",
  "contact": "08123456789",
  "maksimal_produksi": 5000,
  "keterangan": "Supplier bahan baku A"
}
```

---

### `GET /api/supplier`
Mengambil semua data supplier.

---

### `GET /api/supplier/:id`
Mengambil detail supplier berdasarkan ID.

---

### `PUT /api/supplier/:id`
Mengedit informasi supplier.

**Request Body:**
```json
{
  "nama": "PT Maju Mapan",
  "alamat": "Jl. Kenanga No.2",
  "contact": "08123456788",
  "maksimal_produksi": 6000,
  "keterangan": "Updated"
}
```

---

### `DELETE /api/supplier/:id`
Menghapus data supplier berdasarkan ID.

---

## 📊 Nilai Kriteria Supplier

### `POST /api/supplier/:supplierId/nilai-kriteria`
Menambahkan nilai kriteria untuk supplier.

**Request Body:**
```json
{
  "namaKriteria": "Harga",
  "nilai": 3.5
}
```

---

### `GET /api/supplier/:supplierId/nilai-kriteria`
Mengambil seluruh nilai kriteria milik supplier tertentu.

---

### `PUT /api/supplier/nilai-kriteria/:id`
Mengupdate nilai kriteria berdasarkan ID.

**Request Body:**
```json
{
  "namaKriteria": "Kualitas",
  "nilai": 4.2
}
```

---

### `DELETE /api/supplier/nilai-kriteria/:id`
Menghapus nilai kriteria berdasarkan ID.

---

## 📥 Supply

### `POST /api/supply`
Mencatat kebutuhan supply.

**Request Body:**
```json
{
  "nama_barang": "Besi Baja",
  "jumlah": 120
}
```

### `GET /api/supplies`
**Response:**
```json
[
  {
    "id": 1,
    "kebutuhan": "Mur 40",
    "jumlah_kebutuhan": 200,
    "staff_id": 3,
    "tanggal": "2025-05-29T00:00:00.000Z",
    "staff_username": "budi"
  }
]
```
### `GET /api/supplies/:id`

**Response:**
```json
{
  "id": 1,
  "kebutuhan": "Mur",
  "jumlah_kebutuhan": 200,
  "staff_id": 3,
  "tanggal": "2025-05-29T00:00:00.000Z",
  "staff_username": "budi"
}

```
### `PUT /api/supplies/:id`
**Request Body:**
```json
{
  "nama_barang": "Mur 50",
  "jumlah": 300
}
```
## `DELETE /api/supplies/:id`

## 📥 Kriteria

### `GET /api/kriteria`

**Response:**
```json
[
  {
    "id": 1,
    "kode": "C1",
    "nama": "Harga"
  },
  {
    "id": 2,
    "kode": "C2",
    "nama": "Kualitas"
  }
]

```

### `GET /api/kriteria/:id`

**Response:**
```json
{
  "id": 1,
  "kode": "C1",
  "nama": "Harga"
}
```

### `POST /api/kriteria`

**Request Body:**
```json
{
  "kode": "C3",
  "nama": "Waktu Pengiriman"
}
```

**Response:**
```json
{
  "message": "Kriteria berhasil ditambahkan",
  "kriteria_id": 3
}
```

### `PUT /api/kriteria/:id`

**Request Body:**
```json
{
  "kode": "C1",
  "nama": "Harga Update"
}
```
### `DELETE /api/kriteria/:id`
**Response:**
```json
{ "message": "Kriteria berhasil dihapus" }
```

## 📥 Report Entry
### `POST /api/reports/create`
Mencatat laporan.

**Request Body:**
```json
{
  "catatan_supply_id": 12,
  "file_path": "/uploads/laporan-12.pdf",
  "catatan_validasi": "Semua kriteria sudah sesuai",
  "usedCriteria": [
    { "criteriaName": "Harga", "criteriaValue": 0.3 },
    { "criteriaName": "Kualitas", "criteriaValue": 0.25 },
    { "criteriaName": "Waktu Pengiriman", "criteriaValue": 0.2 },
    { "criteriaName": "Kemudahan Komunikasi", "criteriaValue": 0.1 },
    { "criteriaName": "Ketersediaan Stok", "criteriaValue": 0.1 },
    { "criteriaName": "Garansi", "criteriaValue": 0.05 }
  ]
}
```
### `NOTE : nilai total criteriaValue totalnya = 1 (100%) agar bobot AHP valid`


## 🔒 Authorization

Untuk mengakses endpoint selain login, register, dan logout, pengguna **wajib menyertakan JWT Token** pada header:

**Header:**
```
Authorization: Bearer <token>
```

---

## 🧰 Teknologi

- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- BcryptJS

---

## 📄 Lisensi

MIT License © 2025
