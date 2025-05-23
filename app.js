const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const supplyRoutes = require("./src/routes/supplyRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const ahpRoutes = require("./src/routes/ahpRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ahp", ahpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
