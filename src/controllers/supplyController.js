const db = require("../models/db");

exports.inputSupply = (req, res) => {
  const { nama_barang, jumlah } = req.body;
  const staff_id = req.user.id;
  const tanggal = new Date();

  db.query(
    "INSERT INTO catatan_supply (kebutuhan, jumlah_kebutuhan, staff_id, tanggal) VALUES (?, ?, ?, ?)",
    [nama_barang, jumlah, staff_id, tanggal],
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
