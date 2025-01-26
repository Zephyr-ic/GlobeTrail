const verifyEmailMiddleware = (req, res, next) => {
    const user = req.user; // Assuming user info is added by the authentication middleware
  
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before accessing this page.' });
    }
  
    next();
  };
  
  module.exports = verifyEmailMiddleware;