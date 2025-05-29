const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./src/routes/authRoutes");
const supplyRoutes = require("./src/routes/supplyRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const supplierRoutes = require("./src/routes/supplierRoutes");
const kriteriaRoutes = require("./src/routes/kriteriaRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API AHP Supplier",
      version: "1.0.0",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/auth", authRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/kriteria", kriteriaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
