// helpers/ahpIntegrated.js
const db = require("../models/db");

class IntegratedAHPService {
  static CONSISTENCY_INDEX = {
    1: 0,
    2: 0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
  };

  // Fungsi helper untuk mapping ID ke nama kriteria
  static async getCriteriaMapping() {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, nama FROM kriteria`;
      db.query(query, (err, results) => {
        if (err) return reject(err);
        
        const mapping = {};
        const reverseMapping = {};
        
        results.forEach(row => {
          // FIX: Gunakan properti yang benar dari database
          mapping[row.id] = row.nama; // Bukan row.namaKriteria
          reverseMapping[row.nama] = row.id;
        });
        
        resolve({ idToName: mapping, nameToId: reverseMapping });
      });
    });
  }

  // Fungsi untuk transform criteria comparisons dari ID ke nama
  static transformCriteriaComparisons(criteriaComparisons, idToNameMapping) {
    const transformed = {};
    
    // FIX: Pastikan criteriaComparisons tidak kosong dan valid
    if (!criteriaComparisons || typeof criteriaComparisons !== 'object') {
      console.log("⚠️ criteriaComparisons kosong atau tidak valid");
      return transformed;
    }
    
    for (const [criteriaAId, comparisons] of Object.entries(criteriaComparisons)) {
      const criteriaAName = idToNameMapping[criteriaAId];
      if (!criteriaAName) {
        console.log(`⚠️ Criteria ID ${criteriaAId} tidak ditemukan dalam mapping`);
        continue;
      }
      
      transformed[criteriaAName] = {};
      
      if (comparisons && typeof comparisons === 'object') {
        for (const [criteriaBId, value] of Object.entries(comparisons)) {
          const criteriaBName = idToNameMapping[criteriaBId];
          if (criteriaBName) {
            transformed[criteriaAName][criteriaBName] = value;
          }
        }
      }
    }
    
    return transformed;
  }

  // Fungsi untuk transform supplier comparisons dari ID ke nama kriteria
  static transformSupplierComparisons(supplierComparisons, idToNameMapping) {
    const transformed = {};
    
    // FIX: Pastikan supplierComparisons tidak kosong dan valid
    if (!supplierComparisons || typeof supplierComparisons !== 'object') {
      console.log("⚠️ supplierComparisons kosong atau tidak valid");
      return transformed;
    }
    
    for (const [criteriaId, suppliers] of Object.entries(supplierComparisons)) {
      const criteriaName = idToNameMapping[criteriaId];
      if (!criteriaName) {
        console.log(`⚠️ Criteria ID ${criteriaId} tidak ditemukan dalam mapping`);
        continue;
      }
      
      transformed[criteriaName] = suppliers; // supplier comparisons tetap menggunakan supplier ID
    }
    
    return transformed;
  }

  static calculateAHPWeights(matrix) {
    const n = matrix.length;
    const weights = [];

    for (let i = 0; i < n; i++) {
      let product = 1;
      for (let j = 0; j < n; j++) {
        product *= matrix[i][j];
      }
      weights.push(Math.pow(product, 1 / n));
    }

    const sum = weights.reduce((total, weight) => total + weight, 0);
    return weights.map((weight) => weight / sum);
  }

  static calculateConsistencyRatio(matrix) {
    const n = matrix.length;
    if (n <= 2) return 0;

    const colSums = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        colSums[j] += matrix[i][j];
      }
    }

    const normalizedMatrix = matrix.map((row) =>
      row.map((val, j) => val / colSums[j])
    );

    const priorities = normalizedMatrix.map(
      (row) => row.reduce((sum, val) => sum + val, 0) / n
    );

    const weightedSum = matrix.map((row) =>
      row.reduce((sum, val, j) => sum + val * priorities[j], 0)
    );

    const consistencyVector = weightedSum.map((val, i) => val / priorities[i]);
    const lambdaMax = consistencyVector.reduce((sum, val) => sum + val, 0) / n;

    const ci = (lambdaMax - n) / (n - 1);
    const ri = this.CONSISTENCY_INDEX[n] || 1.49;

    return ci / ri;
  }

  static buildMatrix(items, comparisons) {
    console.log("Building matrix for items:", items.map(item => ({ id: item.id, nama: item.nama })));
    console.log("Using comparisons:", comparisons);
    
    return items.map((itemA) =>
      items.map((itemB) => {
        if (itemA.id === itemB.id) return 1;

        const aId = String(itemA.id);
        const bId = String(itemB.id);

        const comparison = comparisons[aId]?.[bId];
        if (comparison !== undefined) {
          console.log(`✅ Found comparison ${aId} vs ${bId}: ${comparison}`);
          return comparison;
        }

        const reverseComparison = comparisons[bId]?.[aId];
        if (reverseComparison !== undefined) {
          console.log(`✅ Found reverse comparison ${bId} vs ${aId}: ${reverseComparison}, using ${1/reverseComparison}`);
          return 1 / reverseComparison;
        }

        console.warn(`⚠️ Tidak ada data perbandingan antara ${aId} dan ${bId}, default 1`);
        return 1;
      })
    );
  }

  // Fungsi utama untuk generate ranking dengan AHP
  static async generateSupplierRankingsWithAHP(
    namaSupply,
    jumlahKebutuhan,
    criteriaComparisons,
    supplierComparisons
  ) {
    try {
      console.log("=== DEBUG INPUT ===");
      console.log("namaSupply:", namaSupply);
      console.log("jumlahKebutuhan:", jumlahKebutuhan);
      console.log("criteriaComparisons:", JSON.stringify(criteriaComparisons, null, 2));
      console.log("supplierComparisons:", JSON.stringify(supplierComparisons, null, 2));

      // Step 0: Get criteria mapping
      const { idToName } = await this.getCriteriaMapping();
      console.log("=== CRITERIA MAPPING ===");
      console.log("idToName:", idToName);
      
      // Transform comparisons dari ID ke nama
      const transformedCriteriaComparisons = this.transformCriteriaComparisons(
        criteriaComparisons, 
        idToName
      );
      const transformedSupplierComparisons = this.transformSupplierComparisons(
        supplierComparisons, 
        idToName
      );

      console.log("=== TRANSFORMED COMPARISONS ===");
      console.log("Transformed criteria comparisons:", JSON.stringify(transformedCriteriaComparisons, null, 2));
      console.log("Transformed supplier comparisons:", JSON.stringify(transformedSupplierComparisons, null, 2));

      // Lanjutkan dengan logic yang sudah ada
      return new Promise((resolve, reject) => {
        // Step 1: Ambil data supplier dengan filter nama_supply
        const getSupplierQuery = `
          SELECT s.id, s.nama, ds.nama_supply, ds.maksimal_produksi 
          FROM detail_supplier ds 
          JOIN supplier s ON ds.supplier_id = s.id 
          WHERE ds.nama_supply = ?
        `;

        db.query(getSupplierQuery, [namaSupply], (err, suppliers) => {
          if (err) return reject("Gagal mengambil data supplier: " + err.message);

          if (suppliers.length === 0) {
            return reject("Tidak ada supplier yang menyediakan supply ini");
          }

          if (suppliers.length < 2) {
            return reject("Minimal 2 supplier diperlukan untuk perbandingan AHP");
          }

          const supplierIds = suppliers.map((s) => s.id);

          // Step 2: Ambil data kriteria yang tersedia
          const getKriteriaQuery = `
            SELECT DISTINCT namaKriteria 
            FROM nilaikriteriasupplier 
            WHERE supplierId IN (?)
          `;

          db.query(getKriteriaQuery, [supplierIds], (err2, kriteriaRows) => {
            if (err2)
              return reject("Gagal mengambil data kriteria: " + err2.message);

            const availableCriteria = kriteriaRows.map((row) => ({
              id: row.namaKriteria,
              nama: row.namaKriteria,
            }));

            if (availableCriteria.length === 0) {
              return reject(
                "Tidak ada kriteria yang tersedia untuk supplier ini"
              );
            }

            console.log("Available criteria:", availableCriteria);

            // Step 3: Ambil nilai kriteria untuk setiap supplier
            const getKriteriaValuesQuery = `
              SELECT supplierId, namaKriteria, nilai 
              FROM nilaikriteriasupplier 
              WHERE supplierId IN (?)
            `;

            db.query(
              getKriteriaValuesQuery,
              [supplierIds],
              (err3, nilaiKriteriaRows) => {
                if (err3)
                  return reject(
                    "Gagal mengambil nilai kriteria: " + err3.message
                  );

                // Validasi konsistensi matrix
                const criteriaMatrix = IntegratedAHPService.buildMatrix(
                  availableCriteria,
                  transformedCriteriaComparisons
                );
                const supplierMatrices = {};
                console.log("Criteria matrix", criteriaMatrix);

                availableCriteria.forEach((criterion) => {
                  supplierMatrices[criterion.id] =
                    IntegratedAHPService.buildMatrix(
                      suppliers,
                      transformedSupplierComparisons[criterion.id] || {}
                    );
                });
                console.log("Supplier matrix per criteria", supplierMatrices);
                
                const validation = IntegratedAHPService.validateConsistency(
                  criteriaMatrix,
                  supplierMatrices
                );

                if (!validation.isValid) {
                  return reject({
                    message: "Matrix tidak konsisten",
                    errors: validation.errors,
                    ratios: validation.ratios,
                  });
                }

                // Step 4: Hitung bobot kriteria dengan AHP
                const criteriaWeights =
                  IntegratedAHPService.calculateAHPWeights(criteriaMatrix);

                // Step 5: Hitung bobot supplier untuk setiap kriteria
                const supplierWeights = {};
                availableCriteria.forEach((criterion) => {
                  supplierWeights[criterion.id] =
                    IntegratedAHPService.calculateAHPWeights(
                      supplierMatrices[criterion.id]
                    );
                });

                // Step 6: Hitung skor final untuk setiap supplier
                const supplierScores = suppliers.map(
                  (supplier, supplierIndex) => {
                    let totalScore = 0;

                    availableCriteria.forEach((criterion, criterionIndex) => {
                      const supplierWeight =
                        supplierWeights[criterion.id][supplierIndex];
                      const criterionWeight = criteriaWeights[criterionIndex];
                      totalScore += supplierWeight * criterionWeight;
                    });

                    return {
                      supplierId: supplier.id,
                      supplierName: supplier.nama,
                      nama_supply: supplier.nama_supply,
                      maksimal_produksi: supplier.maksimal_produksi,
                      score: totalScore,
                      ranking: 0,
                      alokasi_kebutuhan: 0,
                    };
                  }
                );

                // Step 7: Sorting dan alokasi kebutuhan
                supplierScores.sort((a, b) => b.score - a.score);
                let sisaKebutuhan = jumlahKebutuhan;

                supplierScores.forEach((supplier, index) => {
                  supplier.ranking = index + 1;
                  supplier.id = supplier.ranking;

                  if (sisaKebutuhan > 0) {
                    const alokasi = Math.min(
                      sisaKebutuhan,
                      supplier.maksimal_produksi
                    );
                    supplier.alokasi_kebutuhan = alokasi;
                    sisaKebutuhan -= alokasi;
                  }
                });

                // Step 8: Prepare hasil akhir
                const result = {
                  rankings: supplierScores,
                  supply_info: {
                    nama_kebutuhan: namaSupply,
                    jumlah_kebutuhan: jumlahKebutuhan,
                    sisa_kebutuhan: sisaKebutuhan,
                  },
                  ahp_info: {
                    criteria_weights: availableCriteria.map(
                      (criterion, index) => ({
                        criteria_name: criterion.nama,
                        weight: criteriaWeights[index],
                      })
                    ),
                    consistency_ratios: validation.ratios,
                    is_consistent: validation.isValid,
                  },
                };

                resolve(result);
              }
            );
          });
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk generate ranking dari catatan_supply (backward compatibility)
  static async generateSupplierRankingsFromCatatanSupply(
    catatanSupplyId,
    criteriaComparisons,
    supplierComparisons
  ) {
    return new Promise((resolve, reject) => {
      // Step 1: Ambil data dari catatan_supply
      const getCatatanSupplyQuery = `
        SELECT jumlah_kebutuhan, nama_kebutuhan 
        FROM catatan_supply 
        WHERE id = ?
      `;

      db.query(
        getCatatanSupplyQuery,
        [catatanSupplyId],
        async (err, catatanResult) => {
          if (err || catatanResult.length === 0) {
            return reject("Gagal mengambil data catatan_supply");
          }

          const { jumlah_kebutuhan, nama_kebutuhan } = catatanResult[0];

          try {
            const result =
              await IntegratedAHPService.generateSupplierRankingsWithAHP(
                nama_kebutuhan,
                jumlah_kebutuhan,
                criteriaComparisons,
                supplierComparisons
              );
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  static validateConsistency(criteriaMatrix, supplierMatrices) {
    const errors = [];
    const ratios = {};

    const criteriaConsistency = this.calculateConsistencyRatio(criteriaMatrix);
    ratios["criteria"] = criteriaConsistency;

    if (criteriaConsistency > 0.1) {
      errors.push(
        `Konsistensi kriteria tidak memenuhi syarat (${criteriaConsistency.toFixed(
          3
        )} > 0.1)`
      );
    }

    for (const [criteriaId, matrix] of Object.entries(supplierMatrices)) {
      const supplierConsistency = this.calculateConsistencyRatio(matrix);
      ratios[`supplier_${criteriaId}`] = supplierConsistency;

      if (supplierConsistency > 0.1) {
        errors.push(
          `Konsistensi supplier untuk kriteria ${criteriaId} tidak memenuhi syarat (${supplierConsistency.toFixed(
            3
          )} > 0.1)`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      ratios,
    };
  }

  // Helper function untuk membuat matrix perbandingan default
  static createDefaultComparisons(items) {
    const comparisons = {};
    items.forEach((itemA) => {
      comparisons[itemA.id] = {};
      items.forEach((itemB) => {
        if (itemA.id !== itemB.id) {
          comparisons[itemA.id][itemB.id] = 1; // Default equal importance
        }
      });
    });
    return comparisons;
  }
}

module.exports = IntegratedAHPService;