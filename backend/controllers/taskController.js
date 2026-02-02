const { Task, User } = require("../models");

/**
 * Admin: Create + assign task
 * Required: title, description, assignedUserId
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedUserId, status } = req.body;

    if (!title?.trim() || !description?.trim() || !assignedUserId) {
      return res.status(400).json({
        message: "title, description and assignedUserId are required"
      });
    }

    // Ensure assigned user exists
    const assignedUser = await User.findByPk(assignedUserId);
    if (!assignedUser) {
      return res.status(400).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      assignedUserId: Number(assignedUserId),
      status: status || "Pending"
    });

    // Return with assigned user details
    const created = await Task.findByPk(task.id, {
      include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email", "role"] }]
    });

    return res.status(201).json(created);
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
    const where =
      req.user.role === "admin"
        ? {}
        : { assignedUserId: req.user.id };

    const tasks = await Task.findAll({
      where,
      include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]]
    });

    return res.json(tasks);
  } catch (err) {
    console.error("getTasks error:", err);
    return res.status(500).json({ message: "Failed to load tasks" });
  }
};

/**
 * Admin: can update title/description/status/assignedUserId
 * Employee: can update ONLY status (and only their assigned task)
 */
exports.updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Employee restrictions
    if (req.user.role === "employee") {
      if (task.assignedUserId !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "status is required" });
      }

      task.status = status;
      await task.save();

      const updated = await Task.findByPk(task.id, {
        include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email"] }]
      });

      return res.json(updated);
    }

    // Admin update (allow safe fields only)
    if (req.user.role === "admin") {
      const { title, description, status, assignedUserId } = req.body;

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;

      if (assignedUserId !== undefined) {
        const assignedUser = await User.findByPk(assignedUserId);
        if (!assignedUser) {
          return res.status(400).json({ message: "Assigned user not found" });
        }
        task.assignedUserId = Number(assignedUserId);
      }

      await task.save();

      const updated = await Task.findByPk(task.id, {
        include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email"] }]
      });

      return res.json(updated);
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
    const taskId = Number(req.params.id);

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.destroy({ where: { id: taskId } });

    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
