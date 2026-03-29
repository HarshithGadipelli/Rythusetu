import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="brand" onClick={() => navigate("/")}>🌾 Rythu Setu</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/market">Marketplace</Link>
        <Link to="/cart">Cart</Link>
        {user?.role === "farmer" && <Link to="/farmer">Farmer</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        <Link to="/tracking">Tracking</Link>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">{user.name} ({user.role})</span>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
