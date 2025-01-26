import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const InactivityLogout = () => {
  const navigate = useNavigate();

  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 1 minute for testing
  let inactivityTimer;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    // Show toast notification
    toast.warning("You have been logged out due to inactivity.", {
      position: "top-center",
      autoClose: false, // Make sure the toast does not close automatically
      hideProgressBar: true,
      closeButton: true,
      marginTop:'120px'
    });

    // Navigate to login
    navigate("/login");
  };

  useEffect(() => {
    // Listen for user activity
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    // Set the inactivity timer
    inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      clearTimeout(inactivityTimer);
    };
  }, []);

  return null; // Invisible component for inactivity tracking
};

export default InactivityLogout;