// helpers/ahpIntegrated.js
const db = require("../models/db");

class IntegratedAHPService {
  static CONSISTENCY_INDEX = {
    1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24,
    7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
  };

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
    return weights.map(weight => weight / sum);
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

    const normalizedMatrix = matrix.map(row =>
      row.map((val, j) => val / colSums[j])
    );

    const priorities = normalizedMatrix.map(row =>
      row.reduce((sum, val) => sum + val, 0) / n
    );

    const weightedSum = matrix.map(row =>
      row.reduce((sum, val, j) => sum + val * priorities[j], 0)
    );

    const consistencyVector = weightedSum.map((val, i) => val / priorities[i]);
    const lambdaMax = consistencyVector.reduce((sum, val) => sum + val, 0) / n;

    const ci = (lambdaMax - n) / (n - 1);
    const ri = this.CONSISTENCY_INDEX[n] || 1.49;

    return ci / ri;
  }

  static buildMatrix(items, comparisons) {
    return items.map(itemA =>
      items.map(itemB => {
        if (itemA.id === itemB.id) return 1;
        const comparison = comparisons[itemA.id]?.[itemB.id];
        if (comparison) return comparison;
        
        // Jika tidak ada perbandingan langsung, cari kebalikannya
        const reverseComparison = comparisons[itemB.id]?.[itemA.id];
        if (reverseComparison) return 1 / reverseComparison;
        
        return 1; // Default jika tidak ada perbandingan
      })
    );
  }

  // Fungsi utama untuk generate ranking dengan AHP
  static async generateSupplierRankingsWithAHP(namaSupply, jumlahKebutuhan, criteriaComparisons, supplierComparisons) {
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

        const supplierIds = suppliers.map(s => s.id);

        // Step 2: Ambil data kriteria yang tersedia
        const getKriteriaQuery = `
          SELECT DISTINCT namaKriteria 
          FROM nilaikriteriasupplier 
          WHERE supplierId IN (?)
        `;
        
        db.query(getKriteriaQuery, [supplierIds], (err2, kriteriaRows) => {
          if (err2) return reject("Gagal mengambil data kriteria: " + err2.message);

          const availableCriteria = kriteriaRows.map(row => ({
            id: row.namaKriteria,
            nama: row.namaKriteria
          }));

          if (availableCriteria.length === 0) {
            return reject("Tidak ada kriteria yang tersedia untuk supplier ini");
          }

          // Step 3: Ambil nilai kriteria untuk setiap supplier
          const getKriteriaValuesQuery = `
            SELECT supplierId, namaKriteria, nilai 
            FROM nilaikriteriasupplier 
            WHERE supplierId IN (?)
          `;
          
          db.query(getKriteriaValuesQuery, [supplierIds], (err3, nilaiKriteriaRows) => {
            if (err3) return reject("Gagal mengambil nilai kriteria: " + err3.message);

            // Validasi konsistensi matrix
            const criteriaMatrix = IntegratedAHPService.buildMatrix(availableCriteria, criteriaComparisons);
            const supplierMatrices = {};

            availableCriteria.forEach(criterion => {
              supplierMatrices[criterion.id] = IntegratedAHPService.buildMatrix(
                suppliers,
                supplierComparisons[criterion.id] || {}
              );
            });

            const validation = IntegratedAHPService.validateConsistency(criteriaMatrix, supplierMatrices);

            if (!validation.isValid) {
              return reject({
                message: "Matrix tidak konsisten",
                errors: validation.errors,
                ratios: validation.ratios
              });
            }

            // Step 4: Hitung bobot kriteria dengan AHP
            const criteriaWeights = IntegratedAHPService.calculateAHPWeights(criteriaMatrix);
            
            // Step 5: Hitung bobot supplier untuk setiap kriteria
            const supplierWeights = {};
            availableCriteria.forEach(criterion => {
              supplierWeights[criterion.id] = IntegratedAHPService.calculateAHPWeights(
                supplierMatrices[criterion.id]
              );
            });

            // Step 6: Hitung skor final untuk setiap supplier
            const supplierScores = suppliers.map((supplier, supplierIndex) => {
              let totalScore = 0;
              
              availableCriteria.forEach((criterion, criterionIndex) => {
                const supplierWeight = supplierWeights[criterion.id][supplierIndex];
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
                alokasi_kebutuhan: 0
              };
            });

            // Step 7: Sorting dan alokasi kebutuhan
            supplierScores.sort((a, b) => b.score - a.score);
            let sisaKebutuhan = jumlahKebutuhan;
            
            supplierScores.forEach((supplier, index) => {
              supplier.ranking = index + 1;
              supplier.id = supplier.ranking;
              
              if (sisaKebutuhan > 0) {
                const alokasi = Math.min(sisaKebutuhan, supplier.maksimal_produksi);
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
                sisa_kebutuhan: sisaKebutuhan
              },
              ahp_info: {
                criteria_weights: availableCriteria.map((criterion, index) => ({
                  criteria_name: criterion.nama,
                  weight: criteriaWeights[index]
                })),
                consistency_ratios: validation.ratios,
                is_consistent: validation.isValid
              }
            };

            resolve(result);
          });
        });
      });
    });
  }

  // Fungsi untuk generate ranking dari catatan_supply (backward compatibility)
  static async generateSupplierRankingsFromCatatanSupply(catatanSupplyId, criteriaComparisons, supplierComparisons) {
    return new Promise((resolve, reject) => {
      // Step 1: Ambil data dari catatan_supply
      const getCatatanSupplyQuery = `
        SELECT jumlah_kebutuhan, nama_kebutuhan 
        FROM catatan_supply 
        WHERE id = ?
      `;
      
      db.query(getCatatanSupplyQuery, [catatanSupplyId], async (err, catatanResult) => {
        if (err || catatanResult.length === 0) {
          return reject("Gagal mengambil data catatan_supply");
        }

        const { jumlah_kebutuhan, nama_kebutuhan } = catatanResult[0];
        
        try {
          const result = await IntegratedAHPService.generateSupplierRankingsWithAHP(
            nama_kebutuhan,
            jumlah_kebutuhan,
            criteriaComparisons,
            supplierComparisons
          );
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static validateConsistency(criteriaMatrix, supplierMatrices) {
    const errors = [];
    const ratios = {};

    const criteriaConsistency = this.calculateConsistencyRatio(criteriaMatrix);
    ratios['criteria'] = criteriaConsistency;

    if (criteriaConsistency > 0.1) {
      errors.push(`Konsistensi kriteria tidak memenuhi syarat (${criteriaConsistency.toFixed(3)} > 0.1)`);
    }

    for (const [criteriaId, matrix] of Object.entries(supplierMatrices)) {
      const supplierConsistency = this.calculateConsistencyRatio(matrix);
      ratios[`supplier_${criteriaId}`] = supplierConsistency;

      if (supplierConsistency > 0.1) {
        errors.push(`Konsistensi supplier untuk kriteria ${criteriaId} tidak memenuhi syarat (${supplierConsistency.toFixed(3)} > 0.1)`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      ratios
    };
  }

  // Helper function untuk membuat matrix perbandingan default
  static createDefaultComparisons(items) {
    const comparisons = {};
    items.forEach(itemA => {
      comparisons[itemA.id] = {};
      items.forEach(itemB => {
        if (itemA.id !== itemB.id) {
          comparisons[itemA.id][itemB.id] = 1; // Default equal importance
        }
      });
    });
    return comparisons;
  }
}

module.exports = IntegratedAHPService;