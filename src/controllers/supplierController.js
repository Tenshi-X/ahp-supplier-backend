const db = require("../models/db");

// CREATE supplier
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

// READ all suppliers
exports.getAllSuppliers = (req, res) => {
  db.query(
    "SELECT id, nama, alamat, contact, keterangan FROM supplier",
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengambil data supplier" });
      res.json(results);
    }
  );
};

// READ supplier by ID
exports.getSupplierById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT id, nama, alamat, contact, keterangan FROM supplier WHERE id = ?",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengambil supplier" });
      if (results.length === 0)
        return res.status(404).json({ message: "Supplier tidak ditemukan" });
      res.json(results[0]);
    }
  );
};

// UPDATE supplier
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

// DELETE supplier
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

exports.getUniqueNamaSupply = (req, res) => {
  db.query(
    "SELECT DISTINCT nama_supply FROM detail_supplier",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal mengambil data nama_supply" });
      }
      res.json(results.map((row) => row.nama_supply));
    }
  );
};

exports.addSupplyToSupplier = (req, res) => {
  const { supplierId } = req.params;
  const { nama_supply, maksimal_produksi } = req.body;

  db.query(
    "SELECT * FROM supplier WHERE id = ?",
    [supplierId],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengambil supplier" });
      if (results.length === 0)
        return res.status(404).json({ message: "Supplier tidak ditemukan" });

      db.query(
        "INSERT INTO detail_supplier (supplier_id, nama_supply, maksimal_produksi) VALUES (?, ?, ?)",
        [supplierId, nama_supply, maksimal_produksi],
        (err2, result) => {
          if (err2)
            return res
              .status(500)
              .json({ message: "Gagal menambahkan supply baru" });
          res.json({
            message: "Supply berhasil ditambahkan ke supplier",
            new_id: result.insertId,
          });
        }
      );
    }
  );
};

exports.getSuppliesBySupplier = (req, res) => {
  const { supplierId } = req.params;

  db.query(
    "SELECT * FROM detail_supplier WHERE supplier_id = ?",
    [supplierId],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengambil data supply" });
      res.json(results);
    }
  );
};

exports.updateSupply = (req, res) => {
  const { id } = req.params;
  const { nama_supply, maksimal_produksi } = req.body;

  db.query(
    "UPDATE detail_supplier SET nama_supply = ?, maksimal_produksi = ? WHERE id = ?",
    [nama_supply, maksimal_produksi, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal memperbarui supply" });
      res.json({ message: "Supply berhasil diperbarui" });
    }
  );
};

exports.deleteSupply = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM detail_supplier WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus supply" });
    res.json({ message: "Supply berhasil dihapus" });
  });
};
