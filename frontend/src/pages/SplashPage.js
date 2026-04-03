import React, { useState, useEffect } from "react";
import ByEliLogo from "../assets/ByEli.png";
import "../App.css";

const SplashPage = () => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-screen">
      <div className="loader-container">
        <div className="logo-circle">
          <img src={ByEliLogo} alt="Logo" />
        </div>
        <h1>ByEli</h1>
        <div className="spinner"></div>
        <div className="loading-text">
          Loading<span>{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;