const express = require("express");
const { login, profile } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;
