import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../hooks/axiosInstance'; // Adjust your axiosInstance path
import './Login.css';
import GoldenGates from '../assets/GoldenGates-login.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Mail from '../assets/icons/Mail.png';
import RepeatPass from '../assets/icons/RepeatPass.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedError = sessionStorage.getItem('loginError');
    if (storedError) {
      setError(storedError);
      sessionStorage.removeItem('loginError');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEmailError(false);
    setPasswordError(false);

    try {
      const response = await axiosInstance.post('/login', formData);

      console.log('Login Response:', response);

      if (response.data && response.data.accessToken && response.data.refreshToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        navigate('/cabinet');
      } else {
        throw new Error('No tokens received');
      }
    } catch (err) {
      console.error('Login Error:', err);

      if (err.response?.data?.message) {
        const message = err.response.data.message;
        setError(message);
        sessionStorage.setItem('loginError', message);
      }

      if (err.response?.data?.message === 'Invalid password') {
        setPasswordError(true);
      } else if (err.response?.data?.message === 'User not found') {
        setEmailError(true);
      }
    }
  };

  return (
    <>
      <Header customStyleAuth={false} customStyleOverlay={false} />
      
      <div className="login-page">
        <div className="login-container">
          <div className="login-form">
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                </label>
                <img src={Mail} alt="" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={emailError ? 'error-input' : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                </label>
                <img src={RepeatPass} alt="" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={passwordError ? 'error-input' : ''}
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="submit-button">SUBMIT</button>
              <p>
                Not a member of GlobeTrail yet? <Link to="/sign-up">Sign up</Link>
              </p>
           </form>

          </div>

          <div className="login-image">
            <img src={GoldenGates} alt="Golden Gate Bridge" />
          </div>
        </div>
      </div>

      <Footer customStyle={true} />
    </>
  );
};

export default Login;
