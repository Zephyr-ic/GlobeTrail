import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check for the token in sessionStorage
  const token = sessionStorage.getItem('accessToken');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If a token exists, allow access to protected route
  return children;
};

export default PrivateRoute;
