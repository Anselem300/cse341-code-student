const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
  bio: { type: String },
  role: { type: String, default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
