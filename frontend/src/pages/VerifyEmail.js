import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState(''); // Message to display to the user
  const [loading, setLoading] = useState(false); // Tracks if the verification request is in progress
  const [isVerified, setIsVerified] = useState(false); // Tracks if the email was verified successfully
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('token');
  console.log("Frontend Retrieved Token:", verificationToken)

  
  useEffect(() => {
    if (verificationToken) {
      handleVerifyEmail(); // Automatically attempt verification when component loads
    }
  }, [verificationToken]);

  const handleVerifyEmail = async () => {
    if (!verificationToken) {
      setMessage('Invalid or missing token.');
      return;
    }

    setLoading(true);
    setMessage(''); // Clear any previous messages

    try {
      console.log('Verifying token:', verificationToken); // Debug: log the token being verified

      const response = await axios.get('http://localhost:5000/api/email/verify-email', {
        params: { token: verificationToken.trim() }, // Ensure the token is properly trimmed
      });

      setMessage(response.data.message || 'Your email has been successfully verified!');
      setIsVerified(true); // Update the verified status
    } catch (error) {
      console.error('Error during verification:', error.response || error); // Log detailed error
      setMessage(
        error.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      {loading ? (
        <p>Verifying your email, please wait...</p>
      ) : (
        <div>
          {isVerified ? (
            <>
              <h2>Email Verified Successfully</h2>
              <p>Your email has been verified. You can now close this tab or log in to your account.</p>
            </>
          ) : (
            <>
              <h1>Verify Your Email</h1>
              {message && <p style={{ color: 'red' }}>{message}</p>} {/* Display any error messages */}
              <button
                onClick={handleVerifyEmail}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Verify Email
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
