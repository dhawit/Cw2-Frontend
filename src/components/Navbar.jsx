import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleItemClick = (itemName) => {
    setActivePage(itemName);
  };
  const handleLogout = async () => {
    console.log("Logout function triggered");
    try {
      // Simulate successful logout
      const success = true;
  
      if (success) {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${activePage === "home" ? "active" : ""}`}
                onClick={() => handleItemClick("home")}
              >
                Home
              </Link>
            </li>
            {/* Add more navigation items if needed */}
          </ul>
          <form className="d-flex gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Welcome, {user.firstName}!
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/forgot-password">
                      Change password
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button onClick={handleLogin} className="btn btn-outline-danger" type="button">
                  Login
                </button>
                <button onClick={handleRegister} className="btn btn-outline-success" type="button">
                  Register
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
