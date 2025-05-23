const db = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.createReport = (req, res) => {
  const { supply_id, file_path, catatan } = req.body;
  const tanggal_laporan = new Date();

  db.query(
    "INSERT INTO reports (supply_id, file_path, catatan, tanggal_laporan) VALUES (?, ?, ?, ?)",
    [supply_id, file_path, catatan, tanggal_laporan],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal membuat laporan" });
      res.json({ message: "Laporan berhasil dibuat" });
    }
  );
};

exports.getAllReports = (req, res) => {
  db.query("SELECT * FROM reports", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil laporan" });
    res.json(results);
  });
};

exports.updateApproval = (req, res) => {
  const { report_id } = req.params;
  const { status, catatan } = req.body;
  const approved_by = req.user.id;

  db.query(
    "UPDATE reports SET status = ?, catatan = ?, approved_by = ? WHERE id = ?",
    [status, catatan, approved_by, report_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal memperbarui status laporan" });
      res.json({ message: "Status laporan diperbarui" });
    }
  );
};

exports.generatePDF = (req, res) => {
  const { supply_id } = req.params;
  db.query(
    "SELECT s.nama_barang, s.jumlah, u.username, s.tanggal_input FROM supplies s JOIN users u ON s.user_id = u.id WHERE s.id = ?",
    [supply_id],
    (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ message: "Gagal mengambil data supply" });
      const data = results[0];

      const doc = new PDFDocument();
      const filename = `laporan_supply_${supply_id}.pdf`;
      const filePath = `./pdf/${filename}`;

      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(20).text("Laporan Pengadaan Supply", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Nama Barang: ${data.nama_barang}`);
      doc.text(`Jumlah: ${data.jumlah}`);
      doc.text(`Dibuat oleh: ${data.username}`);
      doc.text(`Tanggal Input: ${new Date(data.tanggal_input).toLocaleString()}`);
      doc.end();

      doc.on("finish", () => {
        res.json({ message: "PDF berhasil dibuat", file: filePath });
      });
    }
  );
};

