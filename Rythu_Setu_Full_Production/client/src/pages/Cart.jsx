import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, updateCartQuantity } from "../utils/cart";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="page">
      <div className="card soft">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty. <Link to="/market">Go to marketplace</Link></p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-row" key={item.product._id}>
                <div>
                  <strong>{item.product.name}</strong>
                  <div>₹{item.product.price}</div>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    updateCartQuantity(item.product._id, e.target.value);
                    setCart(getCart());
                  }}
                />
                <button className="btn btn-secondary" onClick={() => {
                  removeFromCart(item.product._id);
                  setCart(getCart());
                }}>Remove</button>
              </div>
            ))}
            <div className="cart-total">Subtotal: ₹{subtotal}</div>
            <button className="btn btn-primary" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </>
        )}
      </div>
    </div>
  );
}
