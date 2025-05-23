// controllers/ahpController.js
const db = require("../models/db");
const {
  normalizeMatrix,
  calculatePriorities,
  calculateConsistencyRatio,
} = require("../utils/ahpUtils");

exports.calculateAHP = (req, res) => {
  const { supply_id } = req.params;

  db.query(
    "SELECT kriteria1_id, kriteria2_id, nilai FROM pairwise_comparisons WHERE supply_id = ?",
    [supply_id],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(500).json({ message: "Gagal mengambil data AHP" });

      const kriteriaSet = new Set();
      results.forEach((r) => {
        kriteriaSet.add(r.kriteria1_id);
        kriteriaSet.add(r.kriteria2_id);
      });
      const kriteriaIds = Array.from(kriteriaSet).sort();
      const size = kriteriaIds.length;
      const matrix = Array(size)
        .fill(null)
        .map(() => Array(size).fill(1));

      results.forEach(({ kriteria1_id, kriteria2_id, nilai }) => {
        const i = kriteriaIds.indexOf(kriteria1_id);
        const j = kriteriaIds.indexOf(kriteria2_id);
        matrix[i][j] = nilai;
        matrix[j][i] = 1 / nilai;
      });

      const normalized = normalizeMatrix(matrix);
      const priorities = calculatePriorities(normalized);
      const cr = calculateConsistencyRatio(matrix, priorities);

      res.json({ priorities, kriteria: kriteriaIds, consistency_ratio: cr });
    }
  );
};
