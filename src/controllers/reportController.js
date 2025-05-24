const db = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.createReport = (req, res) => {
  const { catatan_supply_id, file_path, catatan_validasi } = req.body;
  const tanggal_laporan = new Date();

  db.query(
    "INSERT INTO report (catatan_supply_id, file_path, catatan_validasi, tanggal_laporan) VALUES (?, ?, ?, ?)",
    [catatan_supply_id, file_path, catatan_validasi, tanggal_laporan],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal membuat laporan" });
      }
      res.json({
        message: "Laporan berhasil dibuat",
        report_id: result.insertId,
      });
    }
  );
};

exports.getAllReports = (req, res) => {
  const query = `
    SELECT r.*, u.username, cs.kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input
    FROM report r
    JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
    JOIN users u ON cs.staff_id = u.id
  `;

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil laporan" });
    res.json(results);
  });
};

exports.updateApproval = (req, res) => {
  const { report_id } = req.params;
  const { status, catatan_validasi } = req.body;
  const approved_by = req.user.id;

  db.query(
    "UPDATE report SET status = ?, catatan_validasi = ?, approved_by = ? WHERE id = ?",
    [status, catatan_validasi, approved_by, report_id],
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
  const { report_id } = req.params;

  const query = `
    SELECT cs.kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input, u.username
    FROM report r
    JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
    JOIN users u ON cs.staff_id = u.id
    WHERE r.id = ?
  `;

  db.query(query, [report_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: "Gagal mengambil data laporan" });
    }

    const data = results[0];
    const doc = new PDFDocument();
    const filename = `laporan_report_${report_id}.pdf`;
    const filePath = path.join(__dirname, `../pdf/${filename}`);

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("Laporan Pengadaan Supply", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Nama Barang: ${data.kebutuhan}`);
    doc.text(`Jumlah: ${data.jumlah_kebutuhan}`);
    doc.text(`Dibuat oleh: ${data.username}`);
    doc.text(
      `Tanggal Input: ${new Date(data.tanggal_input).toLocaleDateString()}`
    );
    doc.end();

    doc.on("finish", () => {
      res.json({ message: "PDF berhasil dibuat", file: filePath });
    });
  });
};
