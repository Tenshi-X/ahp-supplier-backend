const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 10, // Buka 10 koneksi siap pakai
  host: "localhost",
  user: "root",
  password: "",
  database: "ahpc2971_ahp-supply",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
  } else {
    console.log("✅ Connected to MySQL database (via pool).");
    connection.release();
  }
});

module.exports = db;
