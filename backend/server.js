require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./config/database");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    await sequelize.sync();
    console.log("Sequelize models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to MySQL:", err.message);
    process.exit(1);
  }
})();
