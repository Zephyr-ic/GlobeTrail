const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require('../models/User');

let connections = new Map(); // Store active SSE connections

// Send Verification Email
const sendVerificationEmail = async (email, token) => {
  const frontendDomain = process.env.BASE_URL || 'http://localhost:3000';
  const verificationURL = `${frontendDomain}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please Verify Your Email Address',
    text: `Welcome! Please verify your email by clicking the link below:\n\n${verificationURL}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email Sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Decoded Token from Request:", decodeURIComponent(token));

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  try {
    const user = await User.findOne({
      where: { verificationToken: token, isVerified: false },
    });
    console.log("User Queried by Token:", user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    // Proceed with verification
    await user.update({ isVerified: true, verificationToken: null });

    // Notify SSE connection
    const connection = connections.get(user.id);
    if (connection) {
      connection.write(`data: ${JSON.stringify({ isVerified: true })}\n\n`);
      connection.end(); // Close connection after sending the final message
      connections.delete(user.id); // Remove connection from map
    }

    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};

// Resend Verification Email
const resendVerificationEmail = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId);

    if (!user || user.isVerified) {
      return res.status(400).json({ message: 'User is already verified or not found.' });
    }

    const newVerificationToken = crypto.randomBytes(32).toString("hex");
    await user.update({ verificationToken: newVerificationToken });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.BASE_URL}/api/verify-email?token=${newVerificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Resend: Verify Your Email',
      text: `Click this link to verify your email: \n\n ${verifyLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification email resent.' });

  } catch (err) {
    res.status(500).json({ message: 'Error resending verification email', error: err.message });
  }
};

const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password
      },
  });

  // Set up email data
  const mailOptions = {
      from: email, // sender address
      to: process.env.EMAIL_USER, // list of receivers
      subject: subject, // Subject line
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // plain text body
  };

  try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
};

module.exports = { 
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  sendEmail
};
