const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "postgres",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "onlinestore",
});

const connectWithRetry = async (retries = 5, delay = 3000) => {
  while (retries > 0) {
    try {
      await pool.connect();
      console.log("✅ Connected to PostgreSQL");
      break;
    } catch (err) {
      console.error(
        `❌ PostgreSQL connection failed. Retries left: ${retries - 1}`
      );
      console.error("Error:", err.message);
      retries--;
      if (retries === 0) {
        console.error("🚨 Could not connect to PostgreSQL. Exiting...");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

connectWithRetry();

module.exports = pool;
