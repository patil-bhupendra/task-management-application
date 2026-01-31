require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await User.deleteMany(); 

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const empPassword = await bcrypt.hash("Emp@123", 10);

    await User.create([
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
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
