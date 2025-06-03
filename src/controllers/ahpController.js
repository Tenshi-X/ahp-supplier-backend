const { calculateWeights } = require('../utils/ahpUtils');

exports.calculateAHP = async (req, res) => {
  try {
    const { pairwiseKriteria, supplierComparisons } = req.body;

    const kriteriaWeights = calculateWeights(pairwiseKriteria);
    const supplierWeights = supplierComparisons.map(matrix => calculateWeights(matrix));

    // Final ranking
    const finalScores = supplierWeights[0].map((_, idx) =>
      supplierWeights.reduce((total, weights, kIdx) =>
        total + (weights[idx] * kriteriaWeights[kIdx]), 0)
    );

    res.json({
      kriteriaWeights,
      supplierWeights,
      finalScores,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
