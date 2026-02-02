const User = require("./User");
const Task = require("./Task");

// A User can have many tasks assigned
User.hasMany(Task, { foreignKey: "assignedUserId", as: "tasks" });

// Each Task belongs to one assigned user
Task.belongsTo(User, { foreignKey: "assignedUserId", as: "assignedUser" });

module.exports = { User, Task };
