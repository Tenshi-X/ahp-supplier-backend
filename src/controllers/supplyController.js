const db = require("../models/db");

// CREATE
exports.inputSupply = (req, res) => {
  const { nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan } = req.body;
  const staff_id = req.user.id;
  const tanggal = new Date();

  db.query(
    "INSERT INTO catatan_supply (nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan, staff_id, tanggal) VALUES (?, ?, ?, ?, ?, ?)",
    [nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan, staff_id, tanggal],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal input kebutuhan supply" });
      }
      res.json({
        message: "Kebutuhan supply berhasil diinput",
        catatan_supply_id: result.insertId,
      });
    }
  );
};

// READ ALL
exports.getAllSupply = (req, res) => {
  db.query(
    `SELECT cs.*, u.username AS staff_username
     FROM catatan_supply cs
     JOIN users u ON cs.staff_id = u.id`,
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengambil data supply" });
      res.json(results);
    }
  );
};

// READ BY ID
exports.getSupplyById = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT cs.*, u.username AS staff_username
     FROM catatan_supply cs
     JOIN users u ON cs.staff_id = u.id
     WHERE cs.id = ?`,
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengambil data supply" });
      if (results.length === 0)
        return res.status(404).json({ message: "Supply tidak ditemukan" });
      res.json(results[0]);
    }
  );
};

// UPDATE
exports.updateSupply = (req, res) => {
  const { id } = req.params;
  const { nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan } = req.body;

  db.query(
    "UPDATE catatan_supply SET nama_pemesan = ?, no_hp = ?, nama_kebutuhan = ?, jumlah_kebutuhan = ? WHERE id = ?",
    [nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal memperbarui supply" });
      res.json({ message: "Supply berhasil diperbarui" });
    }
  );
};

// DELETE
exports.deleteSupply = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM catatan_supply WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus supply" });
    res.json({ message: "Supply berhasil dihapus" });
  });
};
