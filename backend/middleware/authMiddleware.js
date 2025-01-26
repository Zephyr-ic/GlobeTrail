const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.header('Authorization')?.replace('Bearer ', ''); // Get the access token
  const refreshToken = req.body?.refreshToken || req.header('x-refresh-token'); // Get the refresh token from headers or body
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Access denied, no access token provided' });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info from the access token to the request
    return next(); // Proceed to the next middleware or route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      if (!refreshToken) {
        return res.status(401).json({ message: 'Access token expired and no refresh token provided' });
      }

      // Try refreshing the token
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id, username: decodedRefresh.username, email: decodedRefresh.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // Define access token expiry
        );

        // Add the new access token to the response header
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.user = decodedRefresh; // Attach user info from the refresh token to the request
        return next(); // Proceed with the request
      } catch (refreshError) {
        console.error('Refresh token verification failed:', refreshError);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }
    }

    // Other errors during access token validation
    console.error('Access token verification failed:', error);
    return res.status(400).json({ message: 'Invalid access token' });
  }
};

module.exports = authMiddleware;

const protectRoute = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  try {
    // Decode the token and extract user info
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;  // Attach user info (e.g., id, email) to the request object

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protectRoute;
