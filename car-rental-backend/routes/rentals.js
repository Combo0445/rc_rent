import express from "express";
import { callProcedure } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// RENT CAR
router.post("/", auth, async (req, res) => {
  try {
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({ message: "Car ID required" });
    }

    const rentalRows = await callProcedure("sp_create_rental", [Number(carId), req.user.id]);
    const rental = rentalRows?.[0];

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create rental" });
  }
});

// GET MY RENTALS
router.get("/me", auth, async (req, res) => {
  try {
    const my = await callProcedure("sp_get_my_rentals", [req.user.id]);
    res.json(my);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch rentals" });
  }
});

// CANCEL RENTAL
router.delete("/:id", auth, async (req, res) => {
  try {
    const resultRows = await callProcedure("sp_cancel_rental", [Number(req.params.id), req.user.id]);
    const affected = resultRows?.[0]?.affectedRows || 0;

    if (affected === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json({ message: "Rental cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to cancel rental" });
  }
});

export default router;