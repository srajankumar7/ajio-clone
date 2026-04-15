import React from "react";
import { Link } from "react-router-dom";

function Sheader({ userId, setUserId,setUserRole }) {

  const handleLogout = () => {
    localStorage.removeItem("role");
    setUserId(null);
    setUserRole(null);
  };


    return (
    <div className="navbar">
      <Link to="/" className="logo">AJIO</Link>

      <div className="menu">
        <Link to="/men">MEN</Link>
        <Link to="/women">WOMEN</Link>
        <Link to="/kids">KIDS</Link>
        <Link to="/beauty">BEAUTY</Link>
      </div>

      <div className="right">
        <Link to="/cart" style={{ marginLeft: "20px" }}>
          <i className="bi bi-cart"></i>
        </Link>

        {!userId && (
          <Link to="/login">Sign In / Join AJIO</Link>
        )}
      </div>

      {userId && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Sheader;