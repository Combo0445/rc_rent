import express from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import { callProcedure } from "../db.js";

const router = express.Router();

// GET ALL CARS
router.get("/", async (req, res) => {
  try {
    const cars = await callProcedure("sp_get_all_cars");
    res.json(cars);
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
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { brand, type, pricePerDay, available } = req.body;
    const car = await callProcedure("sp_add_car", [brand, type, Number(pricePerDay), Number(available)]);
    res.status(201).json(car[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to add car" });
  }
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { brand, type, pricePerDay, available } = req.body;
    const car = await callProcedure("sp_update_car", [Number(req.params.id), brand, type, Number(pricePerDay), Number(available)]);
    res.json(car[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update car" });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
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
});

export default router;