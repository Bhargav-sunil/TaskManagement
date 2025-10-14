import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/dashboard">PrimeTrade.ai</Link>
          </div>

          <nav className="nav-center">
            <Link
              to="/dashboard"
              className={isActive("/dashboard")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={isActive("/tasks")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tasks
            </Link>
            {user.role === "admin" && (
              <Link
                to="/users"
                className={isActive("/users")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Users
              </Link>
            )}
          </nav>

          <div className="header-right">
            <span className="user-welcome">
              Welcome, {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-logout"
            >
              Logout
            </button>
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav
          className={`nav-mobile ${isMobileMenuOpen ? "nav-mobile-open" : ""}`}
        >
          <Link
            to="/dashboard"
            className={isActive("/dashboard")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={isActive("/tasks")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tasks
          </Link>
          {user.role === "admin" && (
            <Link
              to="/users"
              className={isActive("/users")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </Link>
          )}
          <div className="mobile-user-info">
            <span>Welcome, {user.name}</span>
            <span>Role: {user.role}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
