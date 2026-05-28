import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { callProcedure } from "../db.js";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
const isProduction = process.env.NODE_ENV === "production";

function createTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearTokenCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
}

// REGISTER
router.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUsers = await callProcedure("sp_get_user_by_username", [username]);
      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await callProcedure("sp_register_user", [username, hash, "user"]);
      const user = newUser?.[0];
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      createTokenCookie(res, token);

      res.json({ message: "User registered successfully", user });
    } catch (err) {
      res.status(500).json({ message: err.message || "Registration failed" });
    }
  }
);

// LOGIN
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const users = await callProcedure("sp_get_user_by_username", [username]);
      const user = users?.[0];
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      createTokenCookie(res, token);

      res.json({ user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: err.message || "Login failed" });
    }
  }
);

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

router.put(
  "/password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const users = await callProcedure("sp_get_user_by_username", [req.user.username]);
      const user = users?.[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await callProcedure("sp_update_user_password", [req.user.id, hash]);
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message || "Unable to update password" });
    }
  }
);

router.post("/logout", (req, res) => {
  clearTokenCookie(res);
  res.json({ message: "Logged out" });
});

export default router;