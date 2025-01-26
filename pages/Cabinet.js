import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InactivityLogout from '../components/InactivityTimer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';

const CabinetPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = () => {
    // Step 1: Remove the tokens from localStorage
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Step 2: Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div>
      <Header customStyleOverlay={true}/>
      <h1>Welcome to your Cabinet</h1>

      {/* Display the logout button */}
      <button onClick={handleLogout}>Logout</button>

      <Footer customStyle={true} />
    </div>
  );
};

export default CabinetPage;
