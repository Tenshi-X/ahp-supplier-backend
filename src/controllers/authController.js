// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    }
  );
};

exports.register = (req, res) => {
  const { username, password, email, role } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Hashing error" });
    db.query(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hash, email, role],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Register failed" });
        res.json({ message: "User registered" });
      }
    );
  });
};
