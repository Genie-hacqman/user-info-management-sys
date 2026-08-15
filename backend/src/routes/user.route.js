const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  changePassword
} = require("../controllers/user.controller");
const router = express.Router();
router.use(requireAuth);
router.get("/me", getCurrentUser);
router.put("/me", updateCurrentUser);
router.put("/me/password", changePassword);
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;
