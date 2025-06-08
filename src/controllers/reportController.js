const db = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs").promises;
const path = require("path");
const IntegratedAHPService = require("../helpers/ahpService");

// Promisify database queries
const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// OPTIMIZED: Single transaction with all inserts using existing AHP tables
exports.createReport = async (req, res) => {
  const {
    nama_supply,
    jumlah_kebutuhan,
    nama_pemesan,
    no_telp_pemesan,
    rankings,
    usedCriteria,
    catatan_validasi,
    criteria_comparisons,
    supplier_comparisons,
    consistency_ratios,
    criteria_weights,
    tanggal_laporan,
  } = req.body;

  const staff_id = req.user.id;
  const tanggal_laporan_final = tanggal_laporan
    ? new Date(tanggal_laporan)
    : new Date();
  const tanggal_input = new Date();

  const connection = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 1. Insert catatan_supply
    const catatanResult = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO catatan_supply (nama_pemesan, no_hp, nama_kebutuhan, jumlah_kebutuhan, staff_id, tanggal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          nama_pemesan,
          no_telp_pemesan,
          nama_supply,
          jumlah_kebutuhan,
          staff_id,
          tanggal_input,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const catatan_supply_id = catatanResult.insertId;

    // 2. Create AHP Session
    const ahpSessionResult = await new Promise((resolve, reject) => {
      const consistencyRatio = consistency_ratios?.criteria || null;
      connection.query(
        "INSERT INTO ahp_sessions (nama_supply, status, consistency_ratio) VALUES (?, ?, ?)",
        [nama_supply, "completed", consistencyRatio],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const session_id = ahpSessionResult.insertId;

    // 3. Insert report (dengan referensi ke AHP session)
    const reportResult = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO report (catatan_supply_id, catatan_validasi, status, tanggal_laporan, file_path, approved_by, ahp_session_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          catatan_supply_id,
          catatan_validasi,
          "menunggu",
          tanggal_laporan_final,
          null,
          null,
          session_id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const reportId = reportResult.insertId;

    // 4. Insert used criteria (backward compatibility)
    if (usedCriteria && usedCriteria.length > 0) {
      const values = usedCriteria.map((item) => [
        reportId,
        item.criteriaName,
        item.criteriaValue,
      ]);
      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO usedcriteria (reportId, criteriaName, criteriaValue) VALUES ?",
          [values],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    // 5. Insert criteria weights
    if (criteria_weights && criteria_weights.length > 0) {
      const weightValues = criteria_weights.map((weight) => [
        session_id,
        weight.criteria_id,
        weight.weight_value,
      ]);

      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO criteria_weights (session_id, criteria_id, weight_value) VALUES ?",
          [weightValues],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    // 6. Insert criteria comparisons
    console.log("Step 4: Cek criteria_comparisons =", criteria_comparisons);
    console.log("Step 4.1: Apakah array?", Array.isArray(criteria_comparisons));
    console.log("Step 4.2: Length =", criteria_comparisons?.length);

    if (criteria_comparisons && criteria_comparisons.length > 0) {
      const criteriaCompValues = criteria_comparisons.map((comp) => [
        session_id,
        comp.criteria_a_id,
        comp.criteria_b_id,
        comp.comparison_value,
      ]);

      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO criteria_comparisons (session_id, criteria_a_id, criteria_b_id, comparison_value) VALUES ?",
          [criteriaCompValues],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    // 7. Insert supplier comparisons
    if (supplier_comparisons && supplier_comparisons.length > 0) {
      const supplierCompValues = supplier_comparisons.map((comp) => [
        session_id,
        comp.criteria_id,
        comp.supplier_a_id,
        comp.supplier_b_id,
        comp.comparison_value,
      ]);
      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO supplier_comparisons (session_id, criteria_id, supplier_a_id, supplier_b_id, comparison_value) VALUES ?",
          [supplierCompValues],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    // 8. Insert AHP results (rankings)
    if (rankings && rankings.length > 0) {
      const rankingValues = rankings.map((ranking) => [
        reportId,
        session_id,
        ranking.supplierName,
        ranking.nama_supply,
        ranking.ranking,
        ranking.alokasi_kebutuhan,
      ]);
      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO rankingsuppliers (reportId, session_id, supplierName, nama_supply, ranking, alokasi_kebutuhan) VALUES ?",
          [rankingValues],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      // Insert ke tabel AHP results yang baru
      const ahpResultValues = rankings.map((ranking) => [
        session_id,
        ranking.supplierId,
        ranking.score || 0,
        ranking.ranking,
      ]);

      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO ahp_results (session_id, supplier_id, final_score, ranking_position) VALUES ?",
          [ahpResultValues],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }

    await new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    connection.release();

    // Generate PDF dengan data yang lebih lengkap
    generatePDFForReportOptimized(reportId, session_id)
      .then((fileURL) => {
        dbQuery("UPDATE report SET file_path = ? WHERE id = ?", [
          fileURL,
          reportId,
        ]).catch((err) => console.error("Failed to update file_path:", err));
      })
      .catch((err) => console.error("PDF generation failed:", err));

    res.json({
      message: "Laporan berhasil dibuat, PDF sedang diproses",
      report_id: reportId,
      session_id: session_id,
      catatan_supply_id: catatan_supply_id,
      pdf_processing: true,
    });
  } catch (error) {
    await new Promise((resolve) => {
      connection.rollback(() => resolve());
    });
    connection.release();

    console.error("Error creating report:", error);
    res.status(500).json({
      message: "Gagal membuat laporan",
      error: error.message,
    });
  }
};

// Enhanced PDF generation dengan data dari tabel AHP
const generatePDFForReportOptimized = async (reportId, sessionId) => {
  try {
    // Get basic report data
    const reportQuery = `
      SELECT 
        cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.nama_pemesan, cs.no_hp, 
        cs.tanggal AS tanggal_input, u.username, r.tanggal_laporan,
        ahs.consistency_ratio
      FROM report r
      JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
      JOIN users u ON cs.staff_id = u.id
      LEFT JOIN ahp_sessions ahs ON r.ahp_session_id = ahs.id
      WHERE r.id = ?
    `;

    const reportResults = await dbQuery(reportQuery, [reportId]);

    if (reportResults.length === 0) {
      throw new Error("Data laporan tidak ditemukan");
    }

    const data = reportResults[0];

    // Get criteria weights
    const criteriaQuery = `
      SELECT cw.weight_value, k.nama
      FROM criteria_weights cw
      JOIN kriteria k ON cw.criteria_id = k.id
      WHERE cw.session_id = ?
      ORDER BY cw.weight_value DESC
    `;
    const criteriaResults = await dbQuery(criteriaQuery, [sessionId]);

    // Get AHP results (rankings)
    const rankingsQuery = `
  SELECT ar.final_score, ar.ranking_position, s.nama, rs.alokasi_kebutuhan
FROM ahp_results ar
JOIN supplier s ON ar.supplier_id = s.id
LEFT JOIN rankingsuppliers rs 
  ON ar.session_id = rs.session_id AND rs.supplierName = s.nama AND rs.reportId = ?
WHERE ar.session_id = ?
ORDER BY ar.ranking_position ASC
`;

    const rankingsResults = await dbQuery(rankingsQuery, [reportId, sessionId]);
    // Ensure PDF directory exists
    const folderPath = path.join(__dirname, "../public/pdf");
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }

    const filename = `laporan_report_${reportId}.pdf`;
    const filePath = path.join(folderPath, filename);

    // Generate PDF with streams for better performance
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = require("fs").createWriteStream(filePath);

      doc.pipe(stream);

      doc
        .fontSize(16)
        .text("Rekomendasi Suppliers dengan AHP", { align: "left" })
        .fontSize(12)
        .text("Jl. Terbaik No. 123, Jakarta")
        .text("Telp: (021) 12345678 | www.IndonesiaEmas.co.id")
        .moveTo(50, doc.y + 10)
        .lineTo(550, doc.y + 10)
        .stroke();

      doc.moveDown(2);

      doc
        .fontSize(16)
        .text("LAPORAN PENGADAAN SUPPLY - METODE AHP", { align: "center" });
      doc
        .moveDown(0.5)
        .fontSize(11)
        .text(
          `Tanggal Laporan: ${new Date(
            data.tanggal_laporan
          ).toLocaleDateString()}`
        );

      doc.moveDown();

      doc.fontSize(11).text("Informasi Umum", { underline: true });
      doc.moveDown(0.5);
      const info = [
        [`Nama Barang`, data.nama_kebutuhan],
        [`Jumlah`, data.jumlah_kebutuhan],
        [`Nama Pemesan`, data.nama_pemesan],
        [`No. Telepon`, data.no_hp],
        [`Dibuat oleh`, data.username],
        [`Tanggal Input`, new Date(data.tanggal_input).toLocaleDateString()],
      ];

      info.forEach(([label, value]) => {
        doc
          .font("Helvetica-Bold")
          .text(`${label}:`, { continued: true })
          .font("Helvetica")
          .text(` ${value}`);
      });
      
      if (data.consistency_ratio) {
      doc.moveDown();
      const statusText = data.consistency_ratio <= 0.1 ? "Konsisten" : "Tidak Konsisten";
      doc
        .font("Helvetica-Bold")
        .text("Rasio Konsistensi:", { continued: true })
        .font("Helvetica")
        .text(` ${data.consistency_ratio.toFixed(4)} (${statusText})`);
    }

    if (criteriaResults.length > 0) {
      doc.moveDown();
      doc.fontSize(12).font("Helvetica-Bold").text("Bobot Kriteria", { underline: true });
      doc.moveDown(0.5);

      criteriaResults.forEach((criterion) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(`• ${criterion.nama}: ${(criterion.weight_value * 100).toFixed(2)}%`);
      });
    }

      if (rankingsResults.length > 0) {
        doc.moveDown();
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Ranking Supplier", { underline: true });
        doc.moveDown();

        const tableTop = doc.y + 10;
        const itemX = 50;
        const colWidths = [50, 200, 100, 150];

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("No", itemX, tableTop)
          .text("Nama Supplier", itemX + colWidths[0], tableTop)
          .text("Score", itemX + colWidths[0] + colWidths[1], tableTop)
          .text(
            "Alokasi",
            itemX + colWidths[0] + colWidths[1] + colWidths[2],
            tableTop
          );

        doc
          .moveTo(itemX, tableTop + 15)
          .lineTo(550, tableTop + 15)
          .stroke();

        let y = tableTop + 25;
        rankingsResults.forEach((rank, index) => {
          doc
            .font("Helvetica")
            .fontSize(10)
            .text(`${rank.ranking_position}`, itemX, y)
            .text(rank.nama, itemX + colWidths[0], y)
            .text(
              rank.final_score.toFixed(4),
              itemX + colWidths[0] + colWidths[1],
              y
            )
            .text(
              rank.alokasi_kebutuhan || "-",
              itemX + colWidths[0] + colWidths[1] + colWidths[2],
              y
            );
          y += 20;
        });
      }

      doc.end();

      stream.on("finish", () => {
        const fileURL = `${process.env.BASE_URL}/public/pdf/${filename}`;
        resolve(fileURL);
      });

      stream.on("error", reject);
      doc.on("error", reject);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan laporan dengan data AHP lengkap
exports.getReportWithAHPDetails = async (req, res) => {
  const { report_id } = req.params;

  try {
    // Get basic report data
    const reportQuery = `
      SELECT r.*, cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.nama_pemesan, 
             cs.no_hp, cs.tanggal AS tanggal_input, u.username, r.ahp_session_id
      FROM report r
      JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
      JOIN users u ON cs.staff_id = u.id
      WHERE r.id = ?
    `;
    const reportResult = await dbQuery(reportQuery, [report_id]);

    if (reportResult.length === 0) {
      return res.status(404).json({ message: "Report tidak ditemukan" });
    }

    const report = reportResult[0];
    const sessionId = report.ahp_session_id;

    // Get AHP session info
    const sessionQuery = `SELECT * FROM ahp_sessions WHERE id = ?`;
    const sessionResult = await dbQuery(sessionQuery, [sessionId]);

    // Get criteria weights
    const criteriaQuery = `
      SELECT cw.*, k.nama_kriteria
      FROM criteria_weights cw
      JOIN kriteria k ON cw.criteria_id = k.id
      WHERE cw.session_id = ?
    `;
    const criteriaWeights = await dbQuery(criteriaQuery, [sessionId]);

    // Get criteria comparisons
    const criteriaCompQuery = `
      SELECT cc.*, k1.nama_kriteria as criteria_a_name, k2.nama_kriteria as criteria_b_name
      FROM criteria_comparisons cc
      JOIN kriteria k1 ON cc.criteria_a_id = k1.id
      JOIN kriteria k2 ON cc.criteria_b_id = k2.id
      WHERE cc.session_id = ?
    `;
    const criteriaComparisons = await dbQuery(criteriaCompQuery, [sessionId]);

    // Get supplier comparisons
    const supplierCompQuery = `
      SELECT sc.*, k.nama_kriteria, s1.nama_supplier as supplier_a_name, s2.nama_supplier as supplier_b_name
      FROM supplier_comparisons sc
      JOIN kriteria k ON sc.criteria_id = k.id
      JOIN supplier s1 ON sc.supplier_a_id = s1.id
      JOIN supplier s2 ON sc.supplier_b_id = s2.id
      WHERE sc.session_id = ?
    `;
    const supplierComparisons = await dbQuery(supplierCompQuery, [sessionId]);

    // Get AHP results
    const resultsQuery = `
      SELECT ar.*, s.nama
      FROM ahp_results ar
      JOIN supplier s ON ar.supplier_id = s.id
      WHERE ar.session_id = ?
      ORDER BY ar.ranking_position ASC
    `;
    const ahpResults = await dbQuery(resultsQuery, [sessionId]);

    // Get legacy rankings for backward compatibility
    const legacyRankingsQuery = `SELECT * FROM rankingsuppliers WHERE reportId = ? ORDER BY ranking ASC`;
    const legacyRankings = await dbQuery(legacyRankingsQuery, [report_id]);

    res.json({
      report,
      ahpSession: sessionResult[0],
      criteriaWeights,
      criteriaComparisons,
      supplierComparisons,
      ahpResults,
      legacyRankings,
    });
  } catch (error) {
    console.error("Error getting AHP report details:", error);
    res.status(500).json({ message: "Gagal mengambil detail laporan AHP" });
  }
};

// Fungsi untuk mendapatkan semua AHP sessions
exports.getAllAHPSessions = async (req, res) => {
  try {
    const query = `
      SELECT ahs.*, COUNT(ar.id) as total_suppliers
      FROM ahp_sessions ahs
      LEFT JOIN ahp_results ar ON ahs.id = ar.session_id
      GROUP BY ahs.id
      ORDER BY ahs.created_at DESC
    `;

    const results = await dbQuery(query);
    res.json(results);
  } catch (error) {
    console.error("Error getting AHP sessions:", error);
    res.status(500).json({ message: "Gagal mengambil data AHP sessions" });
  }
};

// Keep existing functions unchanged
exports.checkPDFStatus = async (req, res) => {
  const { report_id } = req.params;

  try {
    const results = await dbQuery("SELECT file_path FROM report WHERE id = ?", [
      report_id,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Report tidak ditemukan" });
    }

    const filePath = results[0].file_path;
    res.json({
      pdf_ready: !!filePath,
      pdf_url: filePath,
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking PDF status" });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const query = `
      SELECT r.*, u.username, cs.nama_kebutuhan, cs.jumlah_kebutuhan, cs.tanggal AS tanggal_input,
             ahs.consistency_ratio, ahs.status as ahp_status
      FROM report r
      JOIN catatan_supply cs ON r.catatan_supply_id = cs.id
      JOIN users u ON cs.staff_id = u.id
      LEFT JOIN ahp_sessions ahs ON r.ahp_session_id = ahs.id
      ORDER BY r.tanggal_laporan DESC
    `;

    const results = await dbQuery(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
};

exports.generateRanking = async (req, res) => {
  try {
    const {
      nama_supply,
      jumlah_kebutuhan,
      criteria_comparisons,
      supplier_comparisons,
    } = req.body;

    // Validasi input
    if (!nama_supply || !jumlah_kebutuhan) {
      return res.status(400).json({
        message: "Nama supply dan jumlah kebutuhan wajib diisi",
      });
    }

    if (!criteria_comparisons || !supplier_comparisons) {
      return res.status(400).json({
        message: "Data perbandingan kriteria dan supplier diperlukan",
      });
    }

    // Generate ranking menggunakan AHP
    const result = await IntegratedAHPService.generateSupplierRankingsWithAHP(
      nama_supply,
      jumlah_kebutuhan,
      criteria_comparisons,
      supplier_comparisons
    );

    res.json({
      success: true,
      message: "Ranking berhasil digenerate",
      data: result,
    });
  } catch (error) {
    console.error("Error generating ranking:", error);

    // Handle error dari AHP validation
    if (error.message && error.errors) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
        consistency_ratios: error.ratios,
      });
    }

    res.status(500).json({
      success: false,
      message: typeof error === "string" ? error : "Gagal generate ranking",
      error: error.message,
    });
  }
};

// Controller untuk generate ranking dari catatan_supply yang sudah ada
exports.generateRankingFromCatatan = async (req, res) => {
  try {
    const { catatan_supply_id } = req.params;
    const { criteria_comparisons, supplier_comparisons } = req.body;

    if (!criteria_comparisons || !supplier_comparisons) {
      return res.status(400).json({
        message: "Data perbandingan kriteria dan supplier diperlukan",
      });
    }

    const result =
      await IntegratedAHPService.generateSupplierRankingsFromCatatanSupply(
        catatan_supply_id,
        criteria_comparisons,
        supplier_comparisons
      );

    res.json({
      success: true,
      message: "Ranking berhasil digenerate",
      data: result,
    });
  } catch (error) {
    console.error("Error generating ranking from catatan:", error);

    if (error.message && error.errors) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
        consistency_ratios: error.ratios,
      });
    }

    res.status(500).json({
      success: false,
      message: typeof error === "string" ? error : "Gagal generate ranking",
      error: error.message,
    });
  }
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
      return res.status(200).json([]); // Tetap kirim 200 OK dengan array kosong
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
