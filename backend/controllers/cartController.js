const db = require("../db/db");

// Add to cart
const addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const product = await db.query("SELECT price FROM products WHERE id = $1", [
      product_id,
    ]);
    if (product.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const price = product.rows[0].price;

    const cart = await db.query(
      "SELECT id FROM shopping_carts WHERE user_id = $1",
      [user_id]
    );
    let cartId =
      cart.rows.length > 0
        ? cart.rows[0].id
        : (
            await db.query(
              "INSERT INTO shopping_carts (user_id) VALUES ($1) RETURNING id",
              [user_id]
            )
          ).rows[0].id;

    await db.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
      [cartId, product_id, quantity, price]
    );

    res.status(201).json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error adding item to cart" });
  }
};

// View cart
const getCart = async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await db.query(
      `SELECT ci.product_id, p.name, ci.quantity, ci.price
       FROM cart_items ci
       JOIN shopping_carts sc ON ci.cart_id = sc.id
       JOIN products p ON ci.product_id = p.id
       WHERE sc.user_id = $1`,
      [user_id]
    );
    res.json({ success: true, cart: result.rows });
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { user_id } = req.query;
  const { productId } = req.params;
  try {
    await db.query(
      `DELETE FROM cart_items 
       WHERE product_id = $1 
       AND cart_id = (SELECT id FROM shopping_carts WHERE user_id = $2)`,
      [productId, user_id]
    );
    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove from Cart Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error removing item from cart" });
  }
};

// Checkout (mock)
const checkoutCart = async (req, res) => {
  const { user_id } = req.body;
  try {
    const cart = await db.query(
      "SELECT id FROM shopping_carts WHERE user_id = $1",
      [user_id]
    );
    if (cart.rows.length === 0) {
      return res.status(400).json({ success: false, message: "No cart found" });
    }

    const cartId = cart.rows[0].id;

    // Create order (mock)
    await db.query(
      "INSERT INTO orders (user_id, status) VALUES ($1, 'Confirmed')",
      [user_id]
    );

    // Clear cart
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    res.json({ success: true, message: "Checkout successful!" });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ success: false, message: "Error during checkout" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
};
