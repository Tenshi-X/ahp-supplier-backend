
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
  "role": "tim_pengadaan"
}
```

---

### `POST /api/auth/logout`
Logout pengguna (menghapus sesi di sisi client).

---

## 🧾 Supplier Management

### `POST /api/supplier`
**Role**: `staff` / `tim_pengadaan`  
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

## 📥 Supply Entry

### `POST /api/supply`
Mencatat kebutuhan supply.

**Request Body:**
```json
{
  "nama_barang": "Besi Baja",
  "jumlah": 120
}
```

---

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
