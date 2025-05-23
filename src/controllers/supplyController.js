const db = require("../models/db");

exports.inputSupply = (req, res) => {
  const { nama_barang, jumlah } = req.body;
  const user_id = req.user.id;
  const tanggal_input = new Date();
  db.query(
    "INSERT INTO supplies (nama_barang, jumlah, tanggal_input, user_id) VALUES (?, ?, ?, ?)",
    [nama_barang, jumlah, tanggal_input, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal input supply" });
      res.json({
        message: "Supply berhasil diinput",
        supply_id: result.insertId,
      });
    }
  );
};

exports.inputPairwise = (req, res) => {
  const { supply_id, comparisons } = req.body; // comparisons: [{ k1, k2, value }]
  const values = comparisons.map(({ k1, k2, value }) => [
    supply_id,
    k1,
    k2,
    value,
  ]);

  db.query(
    "INSERT INTO pairwise_comparisons (supply_id, kriteria1_id, kriteria2_id, nilai) VALUES ?",
    [values],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal input perbandingan AHP" });
      res.json({ message: "Data AHP berhasil disimpan" });
    }
  );
};
