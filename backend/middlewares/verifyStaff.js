const db = require("../db/db");

const verifyStaff = async (req, res, next) => {
  const userId = req.body.user_id || req.query.user_id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await db.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (result.rows[0].role !== "staff") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Staff only" });
    }

    next();
  } catch (err) {
    console.error("verifyStaff error:", err);
    res.status(500).json({ success: false, message: "Authorization error" });
  }
};

module.exports = verifyStaff;
