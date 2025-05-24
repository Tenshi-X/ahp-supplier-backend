const db = require("../models/db");

// CREATE
exports.createSupplier = (req, res) => {
  const { nama, alamat, contact, keterangan } = req.body;

  db.query(
    "INSERT INTO supplier (nama, alamat, contact, keterangan) VALUES (?, ?, ?, ?)",
    [nama, alamat, contact, keterangan],
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
  const { nama, alamat, contact, keterangan } = req.body;

  db.query(
    "UPDATE supplier SET nama = ?, alamat = ?, contact = ?, keterangan = ? WHERE id = ?",
    [nama, alamat, contact, keterangan, id],
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
