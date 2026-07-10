const mongoose = require('mongoose');

const otpRecordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    name: String,
    email: String,
    phone: String,
    password: String, // will be hashed before storing
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Auto-delete expired OTP documents via MongoDB TTL index
otpRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// One OTP per email at a time
otpRecordSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('OtpRecord', otpRecordSchema);
