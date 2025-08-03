require('dotenv').config(); // <-- Add this line at the very top

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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



