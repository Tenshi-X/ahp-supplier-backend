const db = require("../models/db");

// CREATE
exports.createKriteria = (req, res) => {
  const { kode, nama, pertimbangan } = req.body;

  db.query(
    "INSERT INTO kriteria (kode, nama, pertimbangan) VALUES (?, ?, ?)",
    [kode, nama, pertimbangan],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal menambahkan kriteria" });
      }
      res.json({
        message: "Kriteria berhasil ditambahkan",
        kriteria_id: result.insertId,
      });
    }
  );
};

// READ ALL
exports.getAllKriteria = (req, res) => {
  db.query("SELECT * FROM kriteria", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil data kriteria" });
    res.json(results);
  });
};

// READ ONE
exports.getKriteriaById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM kriteria WHERE id = ?", [id], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil kriteria" });
    if (results.length === 0)
      return res.status(404).json({ message: "Kriteria tidak ditemukan" });
    res.json(results[0]);
  });
};

// UPDATE
exports.updateKriteria = (req, res) => {
  const { id } = req.params;
  const { kode, nama , pertimbangan} = req.body;

  db.query(
    "UPDATE kriteria SET kode = ?, nama = ?, pertimbangan = ? WHERE id = ?",
    [kode, nama,pertimbangan, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal memperbarui kriteria" });
      res.json({ message: "Kriteria berhasil diperbarui" });
    }
  );
};

// DELETE
exports.deleteKriteria = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM kriteria WHERE id = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus kriteria" });
    res.json({ message: "Kriteria berhasil dihapus" });
  });
};
