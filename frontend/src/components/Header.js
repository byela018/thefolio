import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ByEliLogo from "../assets/ByEli.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowModal(false);
  };

  return (
    <>
      <header>
        <div className="header-flex">
          <div className="logo-container">
            <img src={ByEliLogo} alt="Logo" />
            <h1>ByEli</h1>
            {user && <span className="user-greeting">Hi, {user.name}!</span>}
          </div>

          <nav className="nav-flex">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>

            {/* Show Contact only if user is not admin */}
            {(!user || user.role !== 'admin') && (
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink>
            )}

            {!user ? (
              <>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>Register</NavLink>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>Gallery</NavLink>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Profile</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>Admin</NavLink>
                )}
                <button onClick={() => setShowModal(true)}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* LOGOUT MODAL */}
      {showModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-btns">
              <button className="submit-btn" onClick={handleLogout}>Yes, Logout</button>
              <button className="edit-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;