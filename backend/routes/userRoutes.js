const express = require("express");
const auth = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const User = require("../models/User");

const router = express.Router();

/**
 * GET /api/users/employees
 * Admin only: returns all employees for task assignment dropdown
 */
router.get("/employees", auth, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("_id name email role")
      .sort({ name: 1 });

    return res.json(employees);
  } catch (err) {
    console.error("GET /api/users/employees error:", err);
    return res.status(500).json({ message: "Failed to load employees" });
  }
});

module.exports = router;
