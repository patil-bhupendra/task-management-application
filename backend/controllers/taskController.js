const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : { assignedUser: req.user._id };

  const tasks = await Task.find(filter).populate("assignedUser", "name");
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (
    req.user.role === "employee" &&
    task.assignedUser.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
