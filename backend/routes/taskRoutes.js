const express = require("express");
const auth = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(auth);

router.post("/", adminOnly, createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", adminOnly, deleteTask);

module.exports = router;
