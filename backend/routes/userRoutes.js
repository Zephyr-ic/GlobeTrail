const express = require('express');
const User = require('../models/User');
const { createUser, loginUser, checkUsername, checkEmail,getUserData} = require('../controllers/userController');

const protectRoute = require('../middleware/authMiddleware');  // Protecting route middleware
const { route } = require('./emailRoutes');

const router = express.Router();

// Routes for creating and managing users
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/check-username', checkUsername);
router.get('/check-email', checkEmail);

router.get('/user', getUserData);
// Uncomment if adding functionality for viewing/updating users
// router.get('/read-user/:userId', protectRoute, readUser);
// router.put('/update-user/:userId', protectRoute, updateUser);
module.exports = router;