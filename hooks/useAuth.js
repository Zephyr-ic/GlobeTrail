import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null); // New state for user information

  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken')); // Initialize with stored token
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh the access token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/refresh-token', { refreshToken });
      const newAccessToken = response.data.accessToken;

      if (newAccessToken) {
        sessionStorage.setItem('accessToken', newAccessToken);
        setAccessToken(newAccessToken); // Update access token state
        return newAccessToken;
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Redirect to login if refresh fails
      return null;
    }
  };

  // Axios request interceptor to add the token to headers and handle refresh if necessary
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        let token = accessToken;

        if (!token) {
          // If there is no token in state, try to refresh it
          token = await refreshToken();
        }

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Eject interceptor on cleanup (when hook unmounts or dependencies change)
    return () => axios.interceptors.request.eject(interceptor);
  }, [accessToken]); // Re-run if accessToken changes

  // Once access token is set, loading state is over
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    setIsLoading(false);
  }, []);

  // Fetch user information
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${storedAccessToken}` }
      })
      .then(response => {
        setUser(response.data); // Assuming the response contains user data
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = () => {
    return !!accessToken;
  };

  return { isAuthenticated, isLoading, user, refreshToken }; // Return user information

};

export default useAuth;
