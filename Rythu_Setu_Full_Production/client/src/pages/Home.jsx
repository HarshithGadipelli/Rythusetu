import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <div className="page">
      <section className="hero card">
        <div className="hero-copy">
          <span className="eyebrow">Farm to Home • Voice First • Trust Driven</span>
          <h1>Rythu Setu</h1>
          <p>
            A real organic food marketplace connecting farmers and customers directly,
            with admin control, delivery tracking, demand insights, and free deployment-ready architecture.
          </p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/register">Get Started</Link>
            <Link className="btn btn-secondary" to="/market">Explore Products</Link>
          </div>
        </div>
        <div className="hero-art">
          <img src="/product-placeholder.svg" alt="Farm illustration" />
        </div>
      </section>

      <section className="grid-3">
        <div className="card soft">
          <h3>Farmer</h3>
          <p>Voice product upload, demand insights, trust score, location sharing.</p>
        </div>
        <div className="card soft">
          <h3>Customer</h3>
          <p>Search by organic, pesticide-free, distance, price, and trust score.</p>
        </div>
        <div className="card soft">
          <h3>Admin</h3>
          <p>Analytics, farmer verification, orders, routing, delivery management.</p>
        </div>
      </section>

      <section className="card soft">
        <h3>Demo Logins</h3>
        <div className="grid-3">
          <div><strong>Admin</strong><br />admin@rythusetu.com<br />Admin@123</div>
          <div><strong>Farmer</strong><br />farmer@rythusetu.com<br />Farmer@123</div>
          <div><strong>Customer</strong><br />customer@rythusetu.com<br />Customer@123</div>
        </div>
      </section>

      <section className="card soft">
        <Chatbot />
      </section>
    </div>
  );
}
