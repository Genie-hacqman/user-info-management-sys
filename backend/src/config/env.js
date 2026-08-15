require("dotenv").config();

const config = {
  PORT: Number(process.env.PORT || 3000),
  HOST: process.env.HOST || "0.0.0.0",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/user_management",
};

module.exports = { config };
