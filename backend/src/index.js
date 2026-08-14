require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const app = express();

// CORS configuration to allow requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "User management API is running" });
});

app.use("/auth", authRoutes); // register, login (public)
app.use("/users", userRoutes); // CRUD (protected)

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`\n✅ User Management API Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🔗 CORS enabled for: ${corsOptions.origin}`);
    console.log(`\n📚 API Routes:`);
    console.log(`   POST   /auth/register    - Register new user`);
    console.log(`   POST   /auth/login       - Login user`);
    console.log(`   GET    /users           - Get all users (protected)`);
    console.log(`   GET    /users/:id       - Get user by ID (protected)`);
    console.log(`   PUT    /users/:id       - Update user (protected)`);
    console.log(`   DELETE /users/:id       - Delete user (protected)`);
    console.log("\n");
  });
}

module.exports = { app };
