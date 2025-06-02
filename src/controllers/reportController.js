// controllers/reportController.js
const db = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const {
  generateSupplierRankingsFromSupplyData,
  generateSupplierRankingsNoInsert,
} = require("../helpers/ahp");

// New function untuk generate ranking berdasarkan data supply langsung
exports.generateRankingFromSupplyData = (req, res) => {
  const { nama_supply, jumlah_kebutuhan, usedCriteria } = req.body;

  // Validasi input
  if (
    !nama_supply ||
    !jumlah_kebutuhan ||
    !usedCriteria ||
    usedCriteria.length === 0
  ) {
    return res.status(400).json({
      message: "Data supply, jumlah kebutuhan, dan kriteria harus diisi",
    });
  }

  generateSupplierRankingsFromSupplyData(
    nama_supply,
    jumlah_kebutuhan,
    usedCriteria
  )
    .then((result) => {
      res.json({
        message: "Ranking berhasil digenerate",
        rankings: result.rankings,
        supply_info: result.supply_info,
      });
    })
    .catch((err) => {
      console.error("Error generating ranking:", err);
      res.status(500).json({
        message: typeof err === "string" ? err : "Gagal generate ranking",
      });
    });
};

// Keep existing function untuk backward compatibility
exports.generateRankingOnly = (req, res) => {
  const { catatan_supply_id, usedCriteria } = req.body;

  generateSupplierRankingsNoInsert(catatan_supply_id, usedCriteria)
    .then((result) => {
      res.json({
        message: "Ranking berhasil digenerate",
        rankings: result.rankings,
        supply_info: result.supply_info,
      });
    })
    .catch((err) => {
      console.error("Error generating ranking:", err);
      res.status(500).json({
        message: typeof err === "string" ? err : "Gagal generate ranking",
      });
    });
};

// Updated createReport function untuk handle data dari multistep modal
exports.createReport = (req, res) => {
  const {
    // Data supply dari step 1
    nama_supply,
    jumlah_kebutuhan,
    nama_pemesan,
    no_telp_pemesan,
    // Data dari step 2 & 3
    rankings,
    usedCriteria,
    catatan_validasi,
  } = req.body;

  const staff_id = req.user.id; // Dari JWT/session
  const tanggal_laporan = new Date();
  const tanggal_input = new Date();

  // Step 1: Insert ke catatan_supply terlebih dahulu
  db.query(
    "INSERT INTO catatan_supply (nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan,  staff_id, tanggal) VALUES (?, ?, ?, ?, ?, ?)",
    [
      nama_pemesan,
      no_telp_pemesan,
      nama_supply,
      jumlah_kebutuhan,
      staff_id,
      tanggal_input,
    ],
    (err, catatanResult) => {
      if (err) {
        console.error("Error inserting catatan_supply:", err);
        return res.status(500).json({ message: "Gagal menyimpan data supply" });
      }

      const catatan_supply_id = catatanResult.insertId;

      // Step 2: Insert report
      db.query(
        "INSERT INTO report (catatan_supply_id, catatan_validasi, status, tanggal_laporan) VALUES (?, ?, ?, ?)",
        [catatan_supply_id, catatan_validasi, "menunggu", tanggal_laporan],
        (err2, reportResult) => {
          if (err2) {
            console.error("Error inserting report:", err2);
            return res.status(500).json({ message: "Gagal membuat laporan" });
          }

          const reportId = reportResult.insertId;

          // Step 3: Insert used criteria
          const values = [];
          const placeholders = usedCriteria
            .map((item) => {
              values.push(reportId, item.criteriaName, item.criteriaValue);
              return "(?, ?, ?)";
            })
            .join(", ");

          const insertUsedCriteriaQuery = `INSERT INTO usedcriteria (reportId, criteriaName, criteriaValue) VALUES ${placeholders}`;

          db.query(insertUsedCriteriaQuery, values, (err3) => {
            if (err3) {
              console.error("Error inserting used criteria:", err3);
              return res.status(500).json({
                message: "Laporan dibuat, tapi gagal menyimpan used criteria",
              });
            }

            // Step 4: Insert rankings yang sudah di-generate sebelumnya
            const insertRankingValues = rankings.map((ranking) => [
              reportId,
              ranking.supplierName,
              ranking.nama_supply,
              ranking.ranking,
              ranking.alokasi_kebutuhan,
            ]);

            const insertRankingQuery = `
              INSERT INTO rankingsuppliers 
              (reportId, supplierName, nama_supply, ranking, alokasi_kebutuhan) 
              VALUES ?
            `;

            db.query(insertRankingQuery, [insertRankingValues], (err4) => {
              if (err4) {
                console.error("Error inserting rankings:", err4);
                return res.status(500).json({
                  message:
                    "Laporan dan used criteria berhasil, tapi gagal menyimpan ranking supplier",
                });
              }

              // Step 5: Generate PDF setelah semua data tersimpan
              generatePDFForReport(reportId, (pdfErr, fileURL) => {
                if (pdfErr) {
                  console.error("Error generating PDF:", pdfErr);
                  return res.status(500).json({
                    message: "Laporan berhasil dibuat, tapi gagal generate PDF",
                    report_id: reportId,
                  });
                }

                // Update file_path di report
                db.query(
                  "UPDATE report SET file_path = ? WHERE id = ?",
                  [fileURL, reportId],
                  (updateErr) => {
                    if (updateErr) {
                      console.error("Gagal update file_path:", updateErr);
                      return res.status(500).json({
                        message:
                          "Laporan berhasil dibuat, PDF berhasil, tapi gagal update file_path",
                        report_id: reportId,
                      });
                    }

                    res.json({
                      message: "Laporan berhasil dibuat lengkap dengan PDF",
                      report_id: reportId,
                      catatan_supply_id: catatan_supply_id,
                      pdf_url: fileURL,
                    });
                  }
                );
              });
            });
          });
        }
      );
    }
  );
};

// Helper function untuk generate PDF
const generatePDFForReport = (reportId, callback) => {
  const query = `
    SELECT cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.nama_pemesan, cs.no_hp, 
           cs.tanggal AS tanggal_input, u.username
    FROM report r
    JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
    JOIN users u ON cs.staff_id = u.id
    WHERE r.id = ?
  `;

  db.query(query, [reportId], (err, results) => {
    if (err || results.length === 0) {
      return callback("Gagal mengambil data laporan untuk PDF");
    }

    const data = results[0];
    const doc = new PDFDocument();
    const filename = `laporan_report_${reportId}.pdf`;
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
    doc.text(`Nama Pemesan: ${data.nama_pemesan}`);
    doc.text(`No. Telepon: ${data.no_telp_pemesan}`);
    doc.text(`Dibuat oleh: ${data.username}`);
    doc.text(
      `Tanggal Input: ${new Date(data.tanggal_input).toLocaleDateString()}`
    );

    // Tambahkan informasi ranking suppliers
    const getRankingQuery = `
      SELECT supplierName, ranking, alokasi_kebutuhan 
      FROM rankingsuppliers 
      WHERE reportId = ? 
      ORDER BY ranking ASC
    `;

    db.query(getRankingQuery, [reportId], (rankErr, rankings) => {
      if (!rankErr && rankings.length > 0) {
        doc.moveDown();
        doc.fontSize(14).text("Ranking Suppliers:", { underline: true });
        doc.moveDown(0.5);

        rankings.forEach((rank, index) => {
          doc
            .fontSize(10)
            .text(
              `${rank.ranking}. ${rank.supplierName} - Alokasi: ${rank.alokasi_kebutuhan} unit`
            );
        });
      }

      doc.end();

      doc.on("finish", () => {
        const fileURL = `${process.env.BASE_URL}/pdf/${filename}`;
        callback(null, fileURL);
      });

      doc.on("error", (pdfError) => {
        callback(pdfError);
      });
    });
  });
};

// Keep existing functions
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

exports.getReportByIdStaff = (req, res) => {
  const { staff_id } = req.params;

  const query = `
    SELECT r.*, u.username, cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input
    FROM report r
    JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
    JOIN users u ON cs.staff_id = u.id
    WHERE cs.staff_id = ?
  `;

  db.query(query, [staff_id], (err, results) => {
    if (err) {
      console.error("Error saat mengambil laporan berdasarkan staff_id:", err);
      return res.status(500).json({
        message:
          "Terjadi kesalahan saat mengambil data laporan untuk staff ini",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Tidak ada laporan ditemukan untuk staff ini",
      });
    }

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
