const express = require("express");
const router = express.Router();
const db = require("../db/db");
const validateName = require("../middlewares/validateName");
const validateEmail = require("../middlewares/validateEmail");
const validatePassword = require("../middlewares/validatePassword");

// 🔐 Signup Route
router.post(
  "/signup",
  validateName,
  validateEmail,
  validatePassword,
  async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const userExists = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
          statusCode: 400,
        });
      }

      const role = req.body.role || "customer";

      const result = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, password, role]
      );

      const user = result.rows[0];
      res.status(201).json({
        user,
        success: true,
        message: "Signup successful!",
        statusCode: 201,
      });
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).json({
        success: false,
        message: "Server error during signup",
        error: err.message,
        statusCode: 500,
      });
    }
  }
);

// 🔓 Login Route
router.post("/login", validateEmail, validatePassword, async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    const user = result.rows[0];
    const isMatch = password == user.password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      statusCode: 200,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
      statusCode: 500,
    });
  }
});

module.exports = router;
