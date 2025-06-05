const express = require("express");
const cors = require("cors");
const pool = require("./db/db"); // ✅ new import for shared DB pool
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200', // Angular frontend
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🛍️ Online Store API is running...");
});

app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = { pool };
