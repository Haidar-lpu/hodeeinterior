const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error connecting to database:", err);
  }
  console.log("✅ Connected to Supabase PostgreSQL");
  release();
});

module.exports = pool;