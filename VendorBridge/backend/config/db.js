const { Pool } = require("pg");
require("dotenv").config();
console.log(process.env.DB_PASSWORD)
const pool = new Pool({
user: "postgres",
host: "localhost",
database: "vendorbridge",
password: "@1157Dipikass",
port: "5432",
});

pool.connect()
.then(() => {
    console.log("✅ PostgreSQL Connected");
})
.catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
});

module.exports = pool;