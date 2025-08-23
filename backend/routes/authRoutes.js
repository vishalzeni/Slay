const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { signup, login, forgotPassword, resetPassword, updateProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// POST /api/refresh
router.post("/refresh", async (req, res) => {
  // Expect refresh token in cookie
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "your_super_refresh_secret_here"
    );
    // Find user by id or userId
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) return res.status(401).json({ error: "User not found" });

    // Issue new access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

module.exports = router;
