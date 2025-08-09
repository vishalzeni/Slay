const express = require("express");
const { updateProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();

// PUT /api/user/profile (protected)
router.put("/profile", requireAuth, updateProfile);


module.exports = router;
