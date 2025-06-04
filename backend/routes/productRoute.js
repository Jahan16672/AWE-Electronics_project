const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/verifyStaff");

const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// This will respond to GET /products
router.get("/products", getAllProducts);

// This will respond to GET /products/:id
router.get("/products/:id", getProductById);

// This will respond to POST /products
router.post("/products", verifyStaff, addProduct);

// This will respond to PUT /products/:id
router.put("/products/:id", verifyStaff, updateProduct);

router.delete("/products/:id", verifyStaff, deleteProduct);

module.exports = router;
