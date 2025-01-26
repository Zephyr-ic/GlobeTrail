const express = require('express');
const { sendVerificationEmail, verifyEmail, resendVerificationEmail,sendEmail } = require('../controllers/emailController'); // Corrected import
const verifyEmailMiddleware = require('../middleware/verifyEmailMiddleware');
const router = express.Router();

// POST route to handle sending verification email
router.post("/send-verification-email", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const verificationURL = `http://your-frontend-domain.com/verify?token=some_token`; // This should use an actual token
      await sendVerificationEmail(email, verificationURL);
  
      res.status(200).json({ message: "Verification email sent." });
    } catch (error) {
      res.status(500).json({ message: "Error sending email verification", error: error.message });
    }
});

router.post("/resend-verification", verifyEmailMiddleware, resendVerificationEmail);
router.get('/verify-email', verifyEmail);

router.post('/send-email', sendEmail);

module.exports = router;
