const express = require("express");
const cors = require("cors");
const pool = require("./db/db"); // ✅ new import for shared DB pool
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("🛍️ Online Store API is running...");
});

app.use("/", authRoutes); // ✅ /signup, /login
app.use("/", productRoutes); // ✅ /products, /products/:id
app.use("/api/cart", cartRoutes); // ✅ /api/cart/...

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export pool for queries in other files
module.exports = { pool };
