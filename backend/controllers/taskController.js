const Task = require("../models/Task");

/**
 * Admin: Create + assign task
 * Required: title, description, assignedUser
 */
exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { title, description, assignedUser, status } = req.body;

    if (!title?.trim() || !description?.trim() || !assignedUser) {
      return res.status(400).json({
        message: "title, description and assignedUser are required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      assignedUser,
      status: status || "Pending",
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * Admin: all tasks
 * Employee: only assigned tasks
 */
exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedUser: req.user._id };

    const tasks = await Task.find(filter)
      .populate("assignedUser", "name email")
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (err) {
    console.error("getTasks error:", err);
    return res.status(500).json({ message: "Failed to load tasks" });
  }
};

/**
 * Admin: can update title/description/status/assignedUser
 * Employee: can update ONLY status (and only their assigned task)
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Employee restrictions
    if (req.user.role === "employee") {
      const isOwner = task.assignedUser?.toString() === req.user._id.toString();
      if (!isOwner) return res.status(403).json({ message: "Not allowed" });

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "status is required" });
      }

      task.status = status;
      await task.save();

      return res.json(task);
    }

    // Admin update (allow safe fields only)
    if (req.user.role === "admin") {
      const { title, description, status, assignedUser } = req.body;

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;
      if (assignedUser !== undefined) task.assignedUser = assignedUser;

      await task.save();
      return res.json(task);
    }

    return res.status(403).json({ message: "Not allowed" });
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

/**
 * Admin: Delete task only
 */
exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
