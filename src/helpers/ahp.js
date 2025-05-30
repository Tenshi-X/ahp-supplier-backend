const db = require("../models/db");

exports.generateSupplierRankings = async (reportId, usedCriteria) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM supplier", (err, suppliers) => {
      if (err) return reject("Gagal mengambil supplier");

      const supplierIds = suppliers.map((s) => s.id);

      // Step 2: Ambil nilai kriteria supplier
      const getKriteriaSupplierQuery = `
        SELECT * FROM nilaikriteriasupplier WHERE supplierId IN (?)
      `;
      db.query(
        getKriteriaSupplierQuery,
        [supplierIds],
        (err2, nilaiKriteriaRows) => {
          if (err2) return reject("Gagal mengambil nilai kriteria supplier");

          // Step 3: Susun data nilai per supplier
          const nilaiPerSupplier = {};
          suppliers.forEach((s) => (nilaiPerSupplier[s.id] = {}));
          nilaiKriteriaRows.forEach((row) => {
            nilaiPerSupplier[row.supplierId][row.namaKriteria] = row.nilai;
          });

          const criteriaNames = usedCriteria.map((c) => c.criteriaName);

          // Step 4: Cari nilai maksimum per kriteria
          const maxPerKriteria = {};
          criteriaNames.forEach((kriteria) => {
            maxPerKriteria[kriteria] = Math.max(
              ...suppliers.map((s) => nilaiPerSupplier[s.id][kriteria] || 0)
            );
          });

          // Step 5: Hitung skor total per supplier
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
              alokasi_kebutuhan: supplier.maksimal_produksi,
              score: totalScore,
            };
          });

          // Step 6: Ranking
          supplierScores.sort((a, b) => b.score - a.score);
          supplierScores.forEach((s, i) => {
            s.ranking = i + 1;
          });

          // Step 7: Insert ke rankingsuppliers
          const insertValues = supplierScores.map((s) => [
            reportId,
            s.supplierName,
            s.nama_supply,
            s.ranking,
            s.alokasi_kebutuhan,
          ]);

          const insertQuery = `
          INSERT INTO rankingsuppliers (reportId, supplierName, nama_supply, ranking, alokasi_kebutuhan)
          VALUES ?
        `;

          db.query(insertQuery, [insertValues], (err3) => {
            if (err3) return reject("Gagal menyimpan ranking supplier");
            resolve("Ranking supplier berhasil disimpan");
          });
        }
      );
    });
  });
};
