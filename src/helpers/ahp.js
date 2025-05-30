const db = require("../models/db");

const db = require("../models/db");

exports.generateSupplierRankings = async (reportId, usedCriteria) => {
  return new Promise((resolve, reject) => {
    // Step 1: Ambil catatan_supply_id dari report
    const getReportQuery = `SELECT catatan_supply_id FROM report WHERE id = ?`;
    db.query(getReportQuery, [reportId], (err, reportResult) => {
      if (err || reportResult.length === 0)
        return reject("Gagal mengambil report");

      const catatanSupplyId = reportResult[0].catatan_supply_id;

      // Step 2: Ambil jumlah_kebutuhan dari catatan_supply
      const getJumlahKebutuhanQuery = `SELECT jumlah_kebutuhan FROM catatan_supply WHERE id = ?`;
      db.query(
        getJumlahKebutuhanQuery,
        [catatanSupplyId],
        (err2, catatanResult) => {
          if (err2 || catatanResult.length === 0)
            return reject("Gagal mengambil jumlah kebutuhan");

          let sisaKebutuhan = catatanResult[0].jumlah_kebutuhan;

          // Step 3: Ambil data supplier
          db.query("SELECT * FROM supplier", (err3, suppliers) => {
            if (err3) return reject("Gagal mengambil supplier");

            const supplierIds = suppliers.map((s) => s.id);

            // Step 4: Ambil nilai kriteria supplier
            const getKriteriaSupplierQuery = `
            SELECT * FROM nilaikriteriasupplier WHERE supplierId IN (?)
          `;
            db.query(
              getKriteriaSupplierQuery,
              [supplierIds],
              (err4, nilaiKriteriaRows) => {
                if (err4)
                  return reject("Gagal mengambil nilai kriteria supplier");

                const nilaiPerSupplier = {};
                suppliers.forEach((s) => (nilaiPerSupplier[s.id] = {}));
                nilaiKriteriaRows.forEach((row) => {
                  nilaiPerSupplier[row.supplierId][row.namaKriteria] =
                    row.nilai;
                });

                const criteriaNames = usedCriteria.map((c) => c.criteriaName);

                // Step 5: Hitung nilai maksimal tiap kriteria
                const maxPerKriteria = {};
                criteriaNames.forEach((kriteria) => {
                  maxPerKriteria[kriteria] = Math.max(
                    ...suppliers.map(
                      (s) => nilaiPerSupplier[s.id][kriteria] || 0
                    )
                  );
                });

                // Step 6: Hitung skor total per supplier
                const supplierScores = suppliers.map((supplier) => {
                  let totalScore = 0;
                  criteriaNames.forEach((kriteria) => {
                    const nilaiSupplier =
                      nilaiPerSupplier[supplier.id][kriteria] || 0;
                    const normalized = maxPerKriteria[kriteria]
                      ? nilaiSupplier / maxPerKriteria[kriteria]
                      : 0;
                    const bobot =
                      usedCriteria.find((c) => c.criteriaName === kriteria)
                        ?.criteriaValue || 0;
                    totalScore += normalized * bobot;
                  });

                  return {
                    supplierId: supplier.id,
                    supplierName: supplier.nama,
                    nama_supply: supplier.nama_supply,
                    maksimal_produksi: supplier.maksimal_produksi,
                    score: totalScore,
                  };
                });

                // Step 7: Ranking dan alokasi kebutuhan
                supplierScores.sort((a, b) => b.score - a.score);
                supplierScores.forEach((s, i) => {
                  s.ranking = i + 1;

                  if (sisaKebutuhan > 0) {
                    const alokasi = Math.min(
                      sisaKebutuhan,
                      s.maksimal_produksi
                    );
                    s.alokasi_kebutuhan = alokasi;
                    sisaKebutuhan -= alokasi;
                  } else {
                    s.alokasi_kebutuhan = 0;
                  }
                });

                // Step 8: Insert ke rankingsuppliers
                const insertValues = supplierScores.map((s) => [
                  reportId,
                  s.supplierName,
                  s.nama_supply,
                  s.ranking,
                  s.alokasi_kebutuhan,
                ]);

                const insertQuery = `
              INSERT INTO rankingsuppliers 
              (reportId, supplierName, nama_supply, ranking, alokasi_kebutuhan) 
              VALUES ?
            `;

                db.query(insertQuery, [insertValues], (err5) => {
                  if (err5) return reject("Gagal menyimpan ranking supplier");
                  resolve("Ranking supplier berhasil disimpan");
                });
              }
            );
          });
        }
      );
    });
  });
};
