const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prismaClient");
const SALT_ROUNDS = 10;
async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      status
    } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email and password are required"
      });
    }
    const existing = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existing) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || '',
        role: role || 'user',
        status: status || 'Active',
        password: hashedPassword
      }
    });
    const {
      password: _,
      ...safeUser
    } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    console.error("Registration error:", err.message || err);
    res.status(500).json({
      error: err.message || "Something went wrong"
    });
  }
}
async function login(req, res) {
  try {
    const {
      email,
      password
    } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required"
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLogin: new Date()
      }
    });
    const token = jwt.sign({
      userId: updatedUser.id
    }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    const {
      password: _,
      ...safeUser
    } = updatedUser;
    res.json({
      token,
      user: safeUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
}
module.exports = {
  register,
  login
};
