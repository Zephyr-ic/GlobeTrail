const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

let connections = new Map(); // Store active SSE connections

router.get('/check-verification-status', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Store the connection
  connections.set(userId, res);

  // Send a keep-alive comment every 30 seconds (optional but recommended)
  const keepAlive = setInterval(() => {
    res.write(":\n\n"); // SSE comment
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive); // Stop keep-alive
    connections.delete(userId); // Remove the connection
  });

  // Start checking verification status
  const checkVerificationStatus = setInterval(async () => {
    const user = await User.findByPk(userId);
    if (user && user.isVerified) {
      res.write(`data: ${JSON.stringify({ isVerified: true })}\n\n`);
      clearInterval(checkVerificationStatus); // Stop checking once verified
      res.end(); // Close the connection
      connections.delete(userId); // Remove connection from map
    }
  }, 5000); // Check every 10 seconds
});

module.exports = router;
