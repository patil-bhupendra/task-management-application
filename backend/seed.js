require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize } = require("./config/database");
const User = require("./models/User");

async function seedUsers() {
  try {
    // connect MySQL
    await sequelize.authenticate();
    console.log("MySQL connected");

    // ensure tables exist
    await sequelize.sync();
    console.log("Tables synced");

    // clear existing users (optional)
    await User.destroy({ where: {} });
    console.log("Users cleared");

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const empPassword = await bcrypt.hash("Emp@123", 10);

    await User.bulkCreate([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin"
      },
      {
        name: "Employee User",
        email: "employee@example.com",
        password: empPassword,
        role: "employee"
      }
    ]);

    console.log("Users seeded successfully");
    console.log("Admin  -> admin@example.com / Admin@123");
    console.log("Employee -> employee@example.com / Emp@123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedUsers();
