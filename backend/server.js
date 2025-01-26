const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes'); // Import email routes
const userRoutes = require('./routes/userRoutes');   // Import user routes
const verifySSE = require('./services/verifySSE');

require('dotenv').config();  // Ensure environment variables are loaded

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000' }));  // Enable CORS for the frontend
app.use(express.json());  // Parsing incoming JSON requests
app.use(bodyParser.json());  // For parsing JSON data from requests

// Define user-related routes
app.use('/api', userRoutes);   // Register user routes under /api/users
app.use('/api/email', emailRoutes);  // Register email routes under /api/email
app.use('/api/sse', verifySSE);
// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});