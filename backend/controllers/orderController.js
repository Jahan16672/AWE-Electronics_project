const db = require("../db/db");

const getOrders = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id || isNaN(Number(user_id))) {
    return res.status(400).json({ success: false, message: "Invalid or missing user_id" });
  }

  try {
    const orders = await db.query(
      `SELECT id, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    res.json({ success: true, orders: orders.rows });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

module.exports = {
  getOrders
};