const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove/:productId", removeFromCart);
router.post("/checkout", checkoutCart);

module.exports = router;
