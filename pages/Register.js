import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import './Register.css';
import worldMap from "../assets/WorldMap.png";
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
  const CancelToken = axios.CancelToken;
  let cancelUsername, cancelEmail;

  // Debounced Username Validation with Request Cancelation
  const debouncedUsernameCheck = debounce(async (username) => {
    if (cancelUsername) cancelUsername(); 
    if (username) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/check-username?username=${username}`,
          { cancelToken: new CancelToken((c) => (cancelUsername = c)) }
        );
        setFormErrors((prev) => ({
          ...prev,
          usernameError: response.data.available ? "" : "Username is already taken.",
        }));
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Username check error:", error);
          setFormErrors((prev) => ({
            ...prev,
            usernameError: "Error checking username.",
          }));
        }
      }
    } else {
      setFormErrors((prev) => ({ ...prev, usernameError: "" }));
    }
  }, 500);

  // Debounced Email Validation with Request Cancelation
  const debouncedEmailCheck = debounce(async (email) => {
    if (cancelEmail) cancelEmail();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setFormErrors((prev) => ({
        ...prev,
        emailError: "Invalid email format.",
      }));
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/check-email?email=${email}`,
        { cancelToken: new CancelToken((c) => (cancelEmail = c)) }
      );
      setFormErrors((prev) => ({
        ...prev,
        emailError: response.data.available ? "" : "Email is already in use.",
      }));
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Email check error:", error);
        setFormErrors((prev) => ({
          ...prev,
          emailError: "Error checking email.",
        }));
      }
    }
  }, 500);

  // Password Validation
  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) {
      setFormErrors((prev) => ({
        ...prev,
        passwordError: "Password must contain at least 8 characters.",
      }));
    } else if (password !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        passwordError: "Passwords do not match.",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, passwordError: "" }));
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      debouncedUsernameCheck(value);
    }

    if (name === "email") {
      debouncedEmailCheck(value);
    }

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      validatePassword(password, confirmPassword);
    }
  };

  // Handle Checkbox Changes
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formErrors.emailError || formErrors.usernameError || formErrors.passwordError) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.status === 201) {
        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);

        if (!user.isVerified) {
          alert("Please verify your email to activate your account.");
        }

        navigate("/verify-waiting");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong during registration. Please try again later.");
    }
  };

  return (
    <>
      <Header customStyleAuth={false} customStyleOverlay={false} />
      <div className="register-page">
        <div className="register-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>SIGN UP</h2>

            <div className="form-group">
              <img src={Username} alt="" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={formErrors.usernameError ? "input-error" : ""}
                onChange={handleChange}
              />
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

            <div className="form-group">
              <img src={Mail} alt="" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={formErrors.emailError ? "input-error" : ""}
                onChange={handleChange}
              />
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
              {formErrors.passwordError && (
                <p className="error-message">{formErrors.passwordError}</p>
              )}
            </div>

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
                formErrors.usernameError ||
                formErrors.emailError ||
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
