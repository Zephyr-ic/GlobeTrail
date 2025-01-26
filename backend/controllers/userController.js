require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require("crypto");
const { sendVerificationEmail } = require('./emailController');

// Logging JWT Secret (for debugging purposes)
console.log('JWT Secret:', process.env.SECRET_KEY);

// Utility function to generate a JWT token
const generateToken = (user, secretKey, expiresIn) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secretKey,
    { expiresIn }
  );
};

// Create User (Sign Up)
exports.createUser = async (req, res) => {
  const { username, name, email, phone, password } = req.body;

  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: "Username, name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated Token:", verificationToken);

    const user = await User.create({
      username,
      name,
      email,
      phone,
      password,
      isVerified: false,
      verificationToken,
    });
    console.log("Token Saved to Database:", user.verificationToken);

    // Generate tokens upon successful registration
    const accessToken = generateToken(user, process.env.SECRET_KEY, "1h");
    const refreshToken = generateToken(user, process.env.SECRET_KEY, "7d");

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving to the database", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Received email: ", email);
    console.log("Found user: ", user);

    // Verify if the user is already validated
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email to activate your account.' });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate tokens upon successful login
    const accessToken = generateToken(user, process.env.SECRET_KEY, '1h'); // 1 hour expiry for access token
    const refreshToken = generateToken(user, process.env.SECRET_KEY, '7d'); // 7 days expiry for refresh token

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to check if a username is already taken
exports.checkUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ 
      message: 'Server error while checking username.',
      error: error.message,
      stack: error.stack
    });
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: 'Server error while checking email.' });
  }
};

// Refresh Token Endpoint (to handle refreshing of access tokens)
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // Generate a new access token
    const accessToken = generateToken(decoded, process.env.SECRET_KEY, '1h');  // 1 hour expiry for access token

    return res.status(200).json({ accessToken });
  });
};

// Updated getUserData function
exports.getUserData = (req, res) => {
  const user = req.user; // Assuming user info is added by the authentication middleware

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user); // Send user data
};
