require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const { config } = require("./config/env");

const app = express();
const allowedOrigins = (config.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "User management API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "user-management-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

if (require.main === module) {
  app.listen(config.PORT, config.HOST, () => {
    console.log(`\n✅ User Management API Server`);
    console.log(`📡 Server running on http://localhost:${config.PORT}`);
    console.log(`🔗 CORS enabled for: ${allowedOrigins.join(", ")}`);
    console.log(`\n📚 API Routes:`);
    console.log(`   GET    /health          - Health check`);
    console.log(`   POST   /auth/register    - Register new user`);
    console.log(`   POST   /auth/login       - Login user`);
    console.log(`   GET    /users           - Get all users (protected)`);
    console.log(`   GET    /users/:id       - Get user by ID (protected)`);
    console.log(`   PUT    /users/:id       - Update user (protected)`);
    console.log(`   DELETE /users/:id       - Delete user (protected)`);
    console.log("\n");
  });
}

module.exports = {
  app,
};
