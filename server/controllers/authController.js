const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// In-memory OTP store: { email -> { otp, expiresAt, userData } }
const otpStore = new Map();

// Helper: generate 6-digit OTP
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// @desc  Send OTP to email before creating account
// @route POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP + user data temporarily
    otpStore.set(email, { otp, expiresAt, userData: { name, email, phone, password } });

    // Send email
    await sendOtpEmail(email, otp, name);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('sendOtp error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Check server email config.' });
  }
};

// @desc  Verify OTP and create account
// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP found for this email. Please register again.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please register again.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // OTP correct — create the user
    const { name, phone, password } = record.userData;

    // Double-check email not registered in the meantime
    const userExists = await User.findOne({ email });
    if (userExists) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password });
    otpStore.delete(email);

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Register user (legacy — kept for compatibility)
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get current user profile
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
