function normalizeMatrix(matrix) {
  const size = matrix.length;
  const columnSums = Array(size).fill(0);

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      columnSums[j] += matrix[i][j];
    }
  }

  return matrix.map(row =>
    row.map((val, j) => val / columnSums[j])
  );
}

function calculateWeights(matrix) {
  const normalized = normalizeMatrix(matrix);
  const size = matrix.length;

  return normalized.map(row =>
    row.reduce((sum, val) => sum + val, 0) / size
  );
}

module.exports = { calculateWeights };
