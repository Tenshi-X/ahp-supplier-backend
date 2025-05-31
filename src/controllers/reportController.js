const db = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { generateSupplierRankings } = require("../helpers/ahp");

exports.createReport = (req, res) => {
  const { catatan_supply_id, file_path, catatan_validasi } = req.body;
  const tanggal_laporan = new Date();

  db.query(
    "INSERT INTO report (catatan_supply_id, file_path, catatan_validasi, status, tanggal_laporan) VALUES (?, ?, ?, ?, ?)",
    [
      catatan_supply_id,
      file_path,
      catatan_validasi,
      "menunggu",
      tanggal_laporan,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal membuat laporan" });
      }
      const reportId = result.insertId;

      const usedCriteria = req.body.usedCriteria;
      const values = [];
      const placeholders = usedCriteria
        .map((item) => {
          values.push(reportId, item.criteriaName, item.criteriaValue);
          return "(?, ?, ?)";
        })
        .join(", ");

      const insertUsedCriteriaQuery = `INSERT INTO usedcriteria (reportId, criteriaName, criteriaValue) VALUES ${placeholders}`;

      db.query(insertUsedCriteriaQuery, values, async (err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({
            message: "Laporan dibuat, tapi gagal menyimpan used criteria",
          });
        }
        try {
          await generateSupplierRankings(reportId, usedCriteria);
          res.json({
            message:
              "Laporan, used criteria, dan ranking supplier berhasil dibuat",
            report_id: reportId,
          });
        } catch (errorMsg) {
          console.error(errorMsg);
          return res.status(500).json({
            message:
              "Laporan dan used criteria berhasil, tapi gagal menyimpan ranking supplier",
          });
        }
      });
    }
  );
};

exports.getAllReports = (req, res) => {
    const query = `
      SELECT r.*, u.username, cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input
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

  exports.getReportByCatatanId = (req, res) => {
    const { catatan_supply_id } = req.params;

    const query = `
      SELECT r.*, cs.nama_kebutuhan, cs.jumlah_kebutuhan, u.username, cs.tanggal AS tanggal_input
      FROM report r
      JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
      JOIN users u ON cs.staff_id = u.id
      WHERE r.catatan_supply_id = ?
    `;

  db.query(query, [catatan_supply_id], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil data" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan untuk catatan_supply_id ini",
      });
    }

    res.json(results[0]);
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
    SELECT cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input, u.username
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
    const folderPath = path.join(__dirname, "../public/pdf");
    const filePath = path.join(folderPath, filename);

    // Pastikan folder /public/pdf/ tersedia
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("Laporan Pengadaan Supply", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Nama Barang: ${data.nama_kebutuhan}`);
    doc.text(`Jumlah: ${data.jumlah_kebutuhan}`);
    doc.text(`Dibuat oleh: ${data.username}`);
    doc.text(
      `Tanggal Input: ${new Date(data.tanggal_input).toLocaleDateString()}`
    );
    doc.end();

    doc.on("finish", () => {
      const fileURL = `${process.env.BASE_URL}/pdf/${filename}`;

      // Update kolom file_path di tabel report
      const updateQuery = "UPDATE report SET file_path = ? WHERE id = ?";
      db.query(updateQuery, [fileURL, report_id], (updateErr) => {
        if (updateErr) {
          console.error("Gagal update file_path:", updateErr);
          return res
            .status(500)
            .json({ message: "Gagal menyimpan file_path ke laporan" });
        }

        res.json({
          message: "PDF berhasil dibuat dan file_path disimpan",
          url: fileURL,
        });
      });
    });
  });
};
