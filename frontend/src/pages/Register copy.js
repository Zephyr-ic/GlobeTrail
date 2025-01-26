import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css';
import worldMap from "../assets/WorldMap.png";
import debounce from "lodash.debounce";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Username from "../assets/icons/Username.png";
import Name from "../assets/icons/Name.png";
import Mail from "../assets/icons/Mail.png";
import Phone from "../assets/icons/Phone.png";
import Pass from "../assets/icons/Pass.png";
import RepeatPass from "../assets/icons/RepeatPass.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
  });

  const navigate = useNavigate();

  // Debounced checks for username
  const debouncedUsernameCheck = debounce(async (username) => {
    if (username) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/check-username?username=${username}`
        );
        if (response.status === 200 && !response.data.available) {
          setFormErrors((prev) => ({
            ...prev,
            usernameError: "This username is already taken.",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, usernameError: "" }));
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        if (error.response && error.response.status === 409) {
          setFormErrors((prev) => ({
            ...prev,
            usernameError: "This username is already taken.",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            usernameError: "An error occurred. Please try again.",
          }));
        }
      }
    } else {
      setFormErrors((prev) => ({ ...prev, usernameError: "" }));
    }
  }, 1000);

  // Debounced checks for email
  const debouncedEmailCheck = debounce(async (email) => {
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setFormErrors((prev) => ({
          ...prev,
          emailError: "Email must contain '@' and a valid domain.",
        }));
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/check-email?email=${email}`
        );
        if (response.status === 200 && !response.data.available) {
          setFormErrors((prev) => ({
            ...prev,
            emailError: "This email is already in use.",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, emailError: "" }));
        }
      } catch (error) {
        console.error("Error checking email availability:", error);
        if (error.response && error.response.status === 409) {
          setFormErrors((prev) => ({
            ...prev,
            emailError: "This email is already in use.",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            emailError: "An error occurred. Please try again.",
          }));
        }
      }
    } else {
      setFormErrors((prev) => ({ ...prev, emailError: "" }));
    }
  }, 500);

  // Debounced password validation
  const validatePassword = debounce((password, confirmPassword) => {
    if (password.length < 8) {
      setFormErrors((prev) => ({
        ...prev,
        passwordError: "Password must contain at least 8 characters.",
      }));
    } else if (confirmPassword && password !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        passwordError: "Passwords do not match.",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, passwordError: "" }));
    }
  }, 1000);

  // Handle input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      debouncedEmailCheck(value);
    }

    if (name === "username") {
      debouncedUsernameCheck(value);
    }

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      validatePassword(password, confirmPassword);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent form submission if there are any errors
    if (
      formErrors.emailError ||
      formErrors.usernameError ||
      formErrors.passwordError
    ) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // Ensure terms are accepted
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      // 1. Register user first
      const registerResponse = await axios.post(
        "http://localhost:5000/api/register",
        {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      console.log("Registration successful!", registerResponse.data);

      if (registerResponse.status === 201) {
        const { accessToken, refreshToken, user } = registerResponse.data;
        
        localStorage.setItem("refreshToken", refreshToken);

        sessionStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);


        if (user.isVerified === false) {
          alert("Please verify your email to activate your account.");
        }

        navigate("/verify-waiting");
      }
    } catch (error) {
      console.error("Error during registration:", error.response || error);
      
      // Check for specific error messages from the server
      if (error.response) {
        if (error.response.status === 409) {
          alert("This username or email is already taken."); // Show specific error message
        } else {
          const message = error.response.data.message;
          alert(message || "Something went wrong. Please try again later.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  return (
    <>
      <Header customStyleAuth={false} customStyleOverlay={false} />
      <div className="register-page">
        <div className="register-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>SIGN UP</h2>

            <div className="error-container">
              <div className="form-group">
                <img src={Username} alt="" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className={formErrors.usernameError ? "input-error" : ""}
                  onChange={handleChange}
                />
              </div>
              {formErrors.usernameError && (
                <p className="error-message">{formErrors.usernameError}</p>
              )}
            </div>

            <div className="form-group">
              <img src={Name} alt="" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>
            <div className="error-container">
              <div className="form-group">
                <img src={Mail} alt="" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={formErrors.emailError ? "input-error" : ""}
                  onChange={handleChange}
                />
              </div>
                {formErrors.emailError && (
                  <p className="error-message">{formErrors.emailError}</p>
                )}
            </div>

            <div className="form-group">
              <img src={Phone} alt="" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <img src={Pass} alt="" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <img src={RepeatPass} alt="" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                onChange={handleChange}
              />
            </div>
            {formErrors.passwordError && (
              <p className="error-message">{formErrors.passwordError}</p>
            )}

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="termsAccepted"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="termsAccepted">
                I agree to the <Link to="/terms-of-use">terms of use</Link> and{" "}
                <Link to="/privacy-policy">privacy policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={
                !formData.username ||
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                formErrors.emailError ||
                formErrors.usernameError ||
                formErrors.passwordError ||
                !formData.termsAccepted
              }
            >
              SUBMIT
            </button>

            <p>
              Already a member? <Link to="/login">Login</Link>
            </p>
          </form>
          <div className="register-image">
            <img
              className="side-image"
              src={worldMap}
              alt="Map and Travel Items"
            />
          </div>
        </div>
      </div>
      <Footer customStyle={true} />
    </>
  );
};

export default Register;
