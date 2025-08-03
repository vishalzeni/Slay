require('dotenv').config(); // <-- Add this line at the very top

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Add nodemailer
const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@sumansi.in",
    pass: "Sumansi@123",
  },
});

// Verify SMTP connection at startup
transporter.verify(function(error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

// Utility function to send email with error logging
const sendMail = async ({ to, subject, html }) => {
  console.log(`[Mail] Attempting to send mail to ${to} with subject "${subject}"`);
  try {
    const info = await transporter.sendMail({
      from: '"Sumansi Clothing" <info@sumansi.in>',
      to,
      subject,
      html,
    });
    console.log(`[Mail] Successfully sent mail to ${to} with subject "${subject}"`);
    console.log(`[Mail] MessageId: ${info.messageId}`);
    console.log(`[Mail] Accepted: ${info.accepted}`);
    console.log(`[Mail] Rejected: ${info.rejected}`);
    // Optionally, log the full info object for debugging
    // console.log(info);
  } catch (err) {
    console.error(`[Mail] Failed to send mail to ${to} with subject "${subject}". Error:`, err);
  }
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Warn if secrets are missing
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.warn("JWT_SECRET or JWT_REFRESH_SECRET is missing from environment variables.");
}

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" }
  );

  return { accessToken, refreshToken };
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ error: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Use dynamic import for nanoid
    const { nanoid } = await import('nanoid');
    const userId = nanoid(12); // Generate unique userId
    const user = new User({ name, email, phone, password: hashedPassword, userId });
    await user.save();

    // Send welcome email
    const now = new Date();
    await sendMail({
      to: email,
      subject: "Welcome to Sumansi Clothing!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#faf7ff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#7a4eab;">Welcome, ${name}!</h2>
          <p>Thank you for signing up at <b>Sumansi Clothing</b>.<br/>
          We're excited to have you join our family.</p>
          <p style="margin:18px 0 8px 0;">Your account details:</p>
          <ul>
            <li><b>Name:</b> ${name}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Phone:</b> ${phone}</li>
            <li><b>Registration Date:</b> ${now.toLocaleString()}</li>
          </ul>
          <p style="margin-top:24px;">Happy Shopping!<br/>Team Sumansi</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
          <small style="color:#888;">If you did not sign up, please ignore this email.</small>
        </div>
      `,
    });

    const tokens = generateTokens(user);
    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        path: "/api/refresh",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        message: "User registered successfully",
        accessToken: tokens.accessToken,
        user: { _id: user._id, name, email, phone, createdAt: user.createdAt, userId: user.userId },
      });
  } catch (err) {
    console.error(err); // Add this line for debugging
    res.status(500).json({ error: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Send login notification email
    const now = new Date();
    await sendMail({
      to: user.email,
      subject: "Login Notification - Sumansi Clothing",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#faf7ff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#7a4eab;">Hello, ${user.name}!</h2>
          <p>Your account was just logged in at <b>Sumansi Clothing</b>.</p>
          <ul>
            <li><b>Email:</b> ${user.email}</li>
            <li><b>Login Date & Time:</b> ${now.toLocaleString()}</li>
          </ul>
          <p style="margin-top:24px;">If this wasn't you, please reset your password immediately.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
          <small style="color:#888;">This is an automated notification from Sumansi Clothing.</small>
        </div>
      `,
    });

    const tokens = generateTokens(user);
    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        path: "/api/refresh",
      })
      .json({
        message: "Login successful",
        accessToken: tokens.accessToken,
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
      });
  } catch (err) {
    console.error(err); // Add this line for debugging
    res.status(500).json({ error: "Server error" });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken });
  });
};



