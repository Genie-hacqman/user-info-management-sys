const bcrypt = require("bcrypt");
const prisma = require("../../prismaClient");

const SALT_ROUNDS = 10;

// Strip password hash before sending user objects back
function toSafeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function createUser(req, res) {
  try {
    const { name, email, password, phone, role, status, profileImage, city, hometown, School } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        phone: phone || '',
        role: role || 'user',
        status: status || 'Active',
        profileImage: profileImage || null,
        city: city || null,
        hometown: hometown || null,
        School: School || null,
      },
    });

    res.status(201).json(toSafeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// GET /users
async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
    res.json(users.map(toSafeUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// GET /users/:id
async function getUserById(req, res) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(toSafeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// PUT /users/:id
async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, email, password, phone, role, status, profileImage, city, hometown, School, passwordResetRequired, lastPasswordResetByAdmin } = req.body;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, SALT_ROUNDS);
    if (phone !== undefined) data.phone = phone;
    if (role) data.role = role;
    if (status) data.status = status;
    if (profileImage !== undefined) data.profileImage = profileImage;
    if (city !== undefined) data.city = city;
    if (hometown !== undefined) data.hometown = hometown;
    if (School !== undefined) data.School = School;
    if (passwordResetRequired !== undefined) data.passwordResetRequired = passwordResetRequired;
    if (lastPasswordResetByAdmin !== undefined) data.lastPasswordResetByAdmin = new Date(lastPasswordResetByAdmin);

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(toSafeUser(user));
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// DELETE /users/:id
async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// GET /users/me - Get current logged-in user
async function getCurrentUser(req, res) {
  try {
    const userId = req.userId; // From JWT token via auth middleware
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(toSafeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// PUT /users/me - Update current user's profile
async function updateCurrentUser(req, res) {
  try {
    const userId = req.userId; // From JWT token via auth middleware
    const { name, email, phone, profileImage, city, hometown, School, role, status } = req.body;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (role) data.role = role;
    if (status) data.status = status;
    if (profileImage !== undefined) data.profileImage = profileImage;
    if (city !== undefined) data.city = city;
    if (hometown !== undefined) data.hometown = hometown;
    if (School !== undefined) data.School = School;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json(toSafeUser(user));
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// PUT /users/me/password - Change password for current user
async function changePassword(req, res) {
  try {
    const userId = req.userId; // From JWT token via auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "currentPassword and newPassword are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Get user and verify current password
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({
      message: "Password changed successfully",
      user: toSafeUser(updatedUser),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, getCurrentUser, updateCurrentUser, changePassword };
