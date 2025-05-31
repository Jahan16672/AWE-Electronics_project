const db = require("../db/db");

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id ASC");
    res.status(200).json({ success: true, products: result.rows });
  } catch (err) {
    console.error("Get Products Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// Fetch single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

// Add new product (admin)
const addProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
      [name, price, stock]
    );
    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  try {
    const result = await db.query(
      "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *",
      [name, price, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
