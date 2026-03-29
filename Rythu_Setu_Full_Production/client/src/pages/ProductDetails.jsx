import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api";
import { addToCart } from "../utils/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct(id).then((res) => setProduct(res.data)).catch(() => {});
  }, [id]);

  if (!product) return <div className="page"><div className="card">Loading...</div></div>;

  const imageSrc = product.photoPath ? `http://localhost:5000${product.photoPath}` : "/product-placeholder.svg";

  const buyNow = () => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="page narrow">
      <div className="card">
        <img src={imageSrc} alt={product.name} className="detail-image" />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>₹{product.price}</p>
        <p>Quantity: {product.quantity}</p>
        <p>Farmer: {product.farmerName}</p>
        <p>Trust Score: {product.farmerTrustScore}</p>
        <div className="button-row">
          <button className="btn btn-primary" onClick={buyNow}>Buy Now</button>
          <button className="btn btn-secondary" onClick={() => { addToCart(product, 1); navigate("/cart"); }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
