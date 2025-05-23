// utils/ahpUtils.js

// Normalisasi matriks perbandingan berpasangan
exports.normalizeMatrix = (matrix) => {
  const size = matrix.length;
  const columnSums = Array(size).fill(0);

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      columnSums[j] += matrix[i][j];
    }
  }

  return matrix.map((row) => row.map((val, j) => val / columnSums[j]));
};

// Hitung bobot prioritas
exports.calculatePriorities = (normalizedMatrix) => {
  return normalizedMatrix.map((row) => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum / row.length;
  });
};

// Cek konsistensi (CR) sederhana (opsional jika ingin validasi)
exports.calculateConsistencyRatio = (matrix, priorities) => {
  const size = matrix.length;
  const lambdaMax =
    matrix
      .map((row, i) => {
        return (
          row.reduce((sum, val, j) => sum + val * priorities[j], 0) /
          priorities[i]
        );
      })
      .reduce((a, b) => a + b, 0) / size;

  const ci = (lambdaMax - size) / (size - 1);
  const riList = [0.0, 0.0, 0.58, 0.9, 1.12, 1.24];
  const ri = riList[size - 1] || 1.24;
  const cr = ci / ri;
  return cr;
};
