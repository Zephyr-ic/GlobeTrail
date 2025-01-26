import React, { useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Overlay from './Overlay';
import logo from '../assets/logo.png';
import OverlayImage from '../assets/Overlay.png';
import useAuth from '../hooks/useAuth'; // Custom hook for authentication

const Header = ({ customStyleAuth = true, customStyleOverlay = false }) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { isAuthenticated} = useAuth();  // Custom hook to get user authentication status
  const location = useLocation(); // For route checks

  const toggleOverlay = () => {
    setOverlayOpen((prevState) => !prevState);
  };

  // Check if we are on the Login or Register page so that these buttons can be shown
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/sign-up';

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img className="logo_img" src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="header-controls">
        <div className="language-container">
          {/* Language buttons always visible */}
          <a className="language-switch" href="#">EST</a>
          <a className="language-switch" href="#">ENG</a>
        </div>

        {/* Only show Login/Register buttons if not on login or register page */}
        {!isLoginPage && !isRegisterPage && !isAuthenticated() && customStyleAuth && (
          <div className="auth-buttons">
            <Link to="/sign-up" className="signup-btn">Register</Link>
            <Link to="/login" className="login">Login</Link>
          </div>
        )}

        {/* Show overlay image toggle only if the user is authenticated and not on login/register page */}
        {!isLoginPage && !isRegisterPage && isAuthenticated() && customStyleOverlay && (
          <div className="overlay-container">
            <img
              src={OverlayImage}
              alt="Overlay Toggle"
              className="toggle-image"
              onClick={toggleOverlay} // Click to toggle the overlay
            />
          </div>
        )}
      </div>

      {/* Render the overlay when open */}
      <Overlay
        overlayOpen={overlayOpen}
        toggleOverlay={toggleOverlay}
        customStyleOverlay={customStyleOverlay}
      />
    </header>
  );
};

export default Header;