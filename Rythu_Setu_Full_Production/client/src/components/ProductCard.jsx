import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageSrc = product.photoPath ? `http://localhost:5000${product.photoPath}` : "/product-placeholder.svg";

  const add = () => {
    addToCart(product, 1);
    alert("Added to cart");
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={imageSrc} alt={product.name} className="product-image" />
      </div>
      <div className="product-body">
        <div className="badge-row">
          {product.organic && <span className="badge green">Organic</span>}
          {product.pesticideFree && <span className="badge amber">Pesticide Free</span>}
          <span className="badge gray">{product.category}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="muted">{product.description || "Fresh from farm"}</p>
        <div className="meta-row">
          <span>₹{product.price}</span>
          <span>Qty: {product.quantity}</span>
        </div>
        <div className="meta-row">
          <span>Farmer: {product.farmerName}</span>
          <span>Trust: {product.farmerTrustScore}</span>
        </div>
        <div className="meta-row">
          <span>Distance: {product.distanceKm != null ? `${product.distanceKm} km` : "—"}</span>
        </div>
        <div className="button-row">
          <button className="btn btn-primary" onClick={() => navigate(`/product/${product._id}`)}>View</button>
          <button className="btn btn-secondary" onClick={add}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
