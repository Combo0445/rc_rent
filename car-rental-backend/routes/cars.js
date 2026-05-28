import express from "express";
import { body, param } from "express-validator";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import { callProcedure } from "../db.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// GET ALL CARS
router.get("/", async (req, res) => {
  try {
    const cars = await callProcedure("sp_get_all_cars");
    const { brand, type } = req.query;

    const filtered = cars.filter((car) => {
      const matchBrand = brand ? car.brand?.toLowerCase().includes(String(brand).toLowerCase()) : true;
      const matchType = type ? car.type?.toLowerCase() === String(type).toLowerCase() : true;
      return matchBrand && matchType;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch cars" });
  }
});

// GET SINGLE CAR BY ID
router.get("/:id", async (req, res) => {
  try {
    const cars = await callProcedure("sp_get_car_by_id", [Number(req.params.id)]);
    const car = cars?.[0];
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch car" });
  }
});

// Admin-only car management
router.post(
  "/",
  auth,
  adminOnly,
  [
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("type").trim().notEmpty().withMessage("Type is required"),
    body("pricePerDay").isFloat({ gt: 0 }).withMessage("Price per day must be a positive number"),
    body("available").isInt({ min: 0 }).withMessage("Available units must be a non-negative integer"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { brand, type, pricePerDay, available } = req.body;
      const car = await callProcedure("sp_add_car", [brand, type, Number(pricePerDay), Number(available)]);
      res.status(201).json(car[0]);
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to add car" });
    }
  }
);

router.put(
  "/:id",
  auth,
  adminOnly,
  [
    param("id").isInt({ gt: 0 }).withMessage("Car ID must be a positive integer"),
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("type").trim().notEmpty().withMessage("Type is required"),
    body("pricePerDay").isFloat({ gt: 0 }).withMessage("Price per day must be a positive number"),
    body("available").isInt({ min: 0 }).withMessage("Available units must be a non-negative integer"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { brand, type, pricePerDay, available } = req.body;
      const car = await callProcedure("sp_update_car", [Number(req.params.id), brand, type, Number(pricePerDay), Number(available)]);
      res.json(car[0]);
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to update car" });
    }
  }
);

router.delete(
  "/:id",
  auth,
  adminOnly,
  [param("id").isInt({ gt: 0 }).withMessage("Car ID must be a positive integer")],
  validateRequest,
  async (req, res) => {
    try {
      const result = await callProcedure("sp_delete_car", [Number(req.params.id)]);
      const affected = result?.[0]?.affectedRows || 0;
      if (affected === 0) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json({ message: "Car deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to delete car" });
    }
  }
);

export default router;