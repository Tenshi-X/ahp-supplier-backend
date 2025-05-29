const db = require("../models/db");

exports.getUsedCriteriaByReport = (req, res) => {
  const { reportId } = req.params;

  db.query(
    "SELECT * FROM usedcriteria WHERE reportId = ?",
    [reportId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengambil data used criteria" });

      res.json(results);
    }
  );
};

exports.getRankingSuppliersByReport = (req, res) => {
  const { reportId } = req.params;

  db.query(
    "SELECT * FROM rankingsuppliers WHERE reportId = ? ORDER BY ranking ASC",
    [reportId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengambil data ranking suppliers" });

      res.json(results);
    }
  );
};
