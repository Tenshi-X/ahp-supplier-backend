// helpers/ahp.js
const db = require("../models/db");

// Function untuk generate ranking berdasarkan nama supply dan jumlah langsung
exports.generateSupplierRankingsFromSupplyData = async (namaSupply, jumlahKebutuhan, usedCriteria) => {
  return new Promise((resolve, reject) => {
    // Step 1: Ambil data supplier dengan filter nama_supply sama
    const getSupplierQuery = `SELECT * FROM detail_supplier ds JOIN supplier s ON ds.supplier_id = s.id WHERE ds.nama_supply = ?`;
    db.query(getSupplierQuery, [namaSupply], (err, suppliers) => {
      if (err) return reject("Gagal mengambil supplier");
      
      if (suppliers.length === 0) {
        return reject("Tidak ada supplier yang menyediakan supply ini");
      }

      const supplierIds = suppliers.map((s) => s.id);

      // Step 2: Ambil nilai kriteria supplier
      const getKriteriaSupplierQuery = `
        SELECT * FROM nilaikriteriasupplier WHERE supplierId IN (?)
      `;
      db.query(getKriteriaSupplierQuery, [supplierIds], (err2, nilaiKriteriaRows) => {
        if (err2) return reject("Gagal mengambil nilai kriteria supplier");
        
        const nilaiPerSupplier = {};
        suppliers.forEach((s) => (nilaiPerSupplier[s.id] = {}));
        nilaiKriteriaRows.forEach((row) => {
          nilaiPerSupplier[row.supplierId][row.namaKriteria] = row.nilai;
        });

        const criteriaNames = usedCriteria.map((c) => c.criteriaName);

        // Step 3: Hitung nilai maksimal tiap kriteria
        const maxPerKriteria = {};
        criteriaNames.forEach((kriteria) => {
          maxPerKriteria[kriteria] = Math.max(
            ...suppliers.map((s) => nilaiPerSupplier[s.id][kriteria] || 0)
          );
        });

        // Step 4: Hitung skor total per supplier
        const supplierScores = suppliers.map((supplier) => {
          let totalScore = 0;
          criteriaNames.forEach((kriteria) => {
            const nilaiSupplier = nilaiPerSupplier[supplier.id][kriteria] || 0;
            const normalized = maxPerKriteria[kriteria]
              ? nilaiSupplier / maxPerKriteria[kriteria]
              : 0;
            const bobot = usedCriteria.find((c) => c.criteriaName === kriteria)?.criteriaValue || 0;
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

        // Step 5: Ranking dan alokasi kebutuhan
        supplierScores.sort((a, b) => b.score - a.score);
        let sisaKebutuhan = jumlahKebutuhan;
        
        supplierScores.forEach((s, i) => {
          s.ranking = i + 1;
          s.id = s.ranking
          if (sisaKebutuhan > 0) {
            const alokasi = Math.min(sisaKebutuhan, s.maksimal_produksi);
            s.alokasi_kebutuhan = alokasi;
            sisaKebutuhan -= alokasi;
          } else {
            s.alokasi_kebutuhan = 0;
          }
        });

        // Return array rankings tanpa insert ke database
        resolve({
          rankings: supplierScores,
          supply_info: {
            nama_kebutuhan: namaSupply,
            jumlah_kebutuhan: jumlahKebutuhan,
            sisa_kebutuhan: sisaKebutuhan
          }
        });
      });
    });
  });
};

// Keep existing function untuk backward compatibility
exports.generateSupplierRankingsNoInsert = async (catatanSupplyId, usedCriteria) => {
  return new Promise((resolve, reject) => {
    // Step 1: Ambil jumlah_kebutuhan dari catatan_supply
    const getCatatanSupplyQuery = `SELECT jumlah_kebutuhan, nama_kebutuhan FROM catatan_supply WHERE id = ?`;
    db.query(getCatatanSupplyQuery, [catatanSupplyId], (err, catatanResult) => {
      if (err || catatanResult.length === 0)
        return reject("Gagal mengambil data catatan_supply");

      let sisaKebutuhan = catatanResult[0].jumlah_kebutuhan;
      const namaSupply = catatanResult[0].nama_kebutuhan;

      // Step 2: Ambil data supplier dengan filter nama_supply sama
      const getSupplierQuery = `SELECT * FROM detail_supplier ds JOIN supplier s ON ds.supplier_id = s.id WHERE ds.nama_supply = ?`;
      db.query(getSupplierQuery, [namaSupply], (err2, suppliers) => {
        if (err2) return reject("Gagal mengambil supplier");

        const supplierIds = suppliers.map((s) => s.id);

        // Step 3: Ambil nilai kriteria supplier
        const getKriteriaSupplierQuery = `
          SELECT * FROM nilaikriteriasupplier WHERE supplierId IN (?)
        `;
        db.query(getKriteriaSupplierQuery, [supplierIds], (err3, nilaiKriteriaRows) => {
          if (err3) return reject("Gagal mengambil nilai kriteria supplier");
          
          const nilaiPerSupplier = {};
          suppliers.forEach((s) => (nilaiPerSupplier[s.id] = {}));
          nilaiKriteriaRows.forEach((row) => {
            nilaiPerSupplier[row.supplierId][row.namaKriteria] = row.nilai;
          });

          const criteriaNames = usedCriteria.map((c) => c.criteriaName);

          // Step 4: Hitung nilai maksimal tiap kriteria
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
              const nilaiSupplier = nilaiPerSupplier[supplier.id][kriteria] || 0;
              const normalized = maxPerKriteria[kriteria]
                ? nilaiSupplier / maxPerKriteria[kriteria]
                : 0;
              const bobot = usedCriteria.find((c) => c.criteriaName === kriteria)?.criteriaValue || 0;
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

          // Step 6: Ranking dan alokasi kebutuhan
          supplierScores.sort((a, b) => b.score - a.score);
          supplierScores.forEach((s, i) => {
            s.ranking = i + 1;

            if (sisaKebutuhan > 0) {
              const alokasi = Math.min(sisaKebutuhan, s.maksimal_produksi);
              s.alokasi_kebutuhan = alokasi;
              sisaKebutuhan -= alokasi;
            } else {
              s.alokasi_kebutuhan = 0;
            }
          });

          // Return array rankings tanpa insert ke database
          resolve({
            rankings: supplierScores,
            supply_info: {
              nama_kebutuhan: namaSupply,
              jumlah_kebutuhan: catatanResult[0].jumlah_kebutuhan,
              sisa_kebutuhan: sisaKebutuhan
            }
          });
        });
      });
    });
  });
};