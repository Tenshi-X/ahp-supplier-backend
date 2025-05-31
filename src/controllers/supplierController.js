const db = require("../models/db");

// CREATE
exports.createSupplier = (req, res) => {
  const { nama, alamat, contact, nama_supply, maksimal_produksi, keterangan } =
    req.body;

  db.query(
    "INSERT INTO supplier (nama, alamat, contact, nama_supply, maksimal_produksi, keterangan) VALUES (?, ?, ?, ?, ?, ?)",
    [nama, alamat, contact, nama_supply, maksimal_produksi, keterangan],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal menambahkan supplier" });
      }
      res.json({
        message: "Supplier berhasil ditambahkan",
        supplier_id: result.insertId,
      });
    }
  );
};

// READ ALL
exports.getAllSuppliers = (req, res) => {
  db.query("SELECT * FROM supplier", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil data supplier" });
    res.json(results);
  });
};

// READ ONE
exports.getSupplierById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM supplier WHERE id = ?", [id], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil supplier" });
    if (results.length === 0)
      return res.status(404).json({ message: "Supplier tidak ditemukan" });
    res.json(results[0]);
  });
};

// UPDATE
exports.updateSupplier = (req, res) => {
  const { id } = req.params;
  const { nama, alamat, contact, nama_supply, maksimal_produksi, keterangan } =
    req.body;

  db.query(
    "UPDATE supplier SET nama = ?, alamat = ?, contact = ?, nama_supply = ?, maksimal_produksi = ?, keterangan = ? WHERE id = ?",
    [nama, alamat, contact, nama_supply, maksimal_produksi, keterangan, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal memperbarui supplier" });
      res.json({ message: "Supplier berhasil diperbarui" });
    }
  );
};

// DELETE
exports.deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM supplier WHERE id = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus supplier" });
    res.json({ message: "Supplier berhasil dihapus" });
  });
};

// CREATE nilaiKriteriaSupplier
exports.addNilaiKriteria = (req, res) => {
  const { supplierId } = req.params;
  const { namaKriteria, nilai } = req.body;

  db.query(
    "INSERT INTO nilaikriteriasupplier (supplierId, namaKriteria, nilai) VALUES (?, ?, ?)",
    [supplierId, namaKriteria, nilai],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal menambahkan nilai kriteria" });
      }
      res.json({
        message: "Nilai kriteria berhasil ditambahkan",
        id: result.insertId,
      });
    }
  );
};

// GET all nilaiKriteria by supplier
exports.getNilaiKriteriaBySupplier = (req, res) => {
  const { supplierId } = req.params;

  db.query(
    "SELECT * FROM nilaikriteriasupplier WHERE supplierId = ?",
    [supplierId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengambil nilai kriteria" });
      res.json(results);
    }
  );
};

// UPDATE nilaiKriteria
exports.updateNilaiKriteria = (req, res) => {
  const { id } = req.params;
  const { namaKriteria, nilai } = req.body;

  db.query(
    "UPDATE nilaikriteriasupplier SET namaKriteria = ?, nilai = ? WHERE id = ?",
    [namaKriteria, nilai, id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal memperbarui nilai kriteria" });
      res.json({ message: "Nilai kriteria berhasil diperbarui" });
    }
  );
};

// DELETE nilaiKriteria
exports.deleteNilaiKriteria = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM nilaikriteriasupplier WHERE id = ?",
    [id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal menghapus nilai kriteria" });
      res.json({ message: "Nilai kriteria berhasil dihapus" });
    }
  );
};
