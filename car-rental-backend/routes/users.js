import express from "express";
import bcrypt from "bcryptjs";
import { callProcedure } from "../db.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

// List all users (admin only)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const users = await callProcedure("sp_get_all_users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
});

// Create user with role (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "username, password and role are required" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await callProcedure("sp_register_user", [username, hash, role]);
    res.status(201).json(newUser[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create user" });
  }
});

// Update user role (admin only)
router.put("/:id/role", auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = Number(req.params.id);

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updated = await callProcedure("sp_update_user_role", [userId, role]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update user role" });
  }
});

// Delete user (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const result = await callProcedure("sp_delete_user", [userId]);
    const affected = result?.[0]?.affectedRows || 0;

    if (affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete user" });
  }
});

export default router;
