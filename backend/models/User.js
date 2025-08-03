const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: String, required: true, unique: true }, // Unique user ID
  createdAt: { type: Date, default: Date.now }, // Store registration date
});

module.exports = mongoose.model("User", userSchema);
