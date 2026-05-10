const express = require('express');
const rateLimit = require('express-rate-limit');
const { canSendOTP, storeOTP, verifyOTP, getResendCooldown } = require('../store/otpStore');
const { sendOTPEmail } = require('../services/emailService');

const router = express.Router();

// Rate limiter for OTP send: 10 requests per 15 minutes per IP
const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many OTP requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP verify: 20 requests per 15 minutes per IP
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many verification attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/otp/send
 * Body: { email: string }
 * Generates and sends OTP to the given email.
 */
router.post('/send', sendLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // Check rate limits and cooldown
    const check = canSendOTP(normalizedEmail);
    if (!check.allowed) {
      return res.status(429).json({ success: false, error: check.reason });
    }

    // Generate and store OTP
    const otp = storeOTP(normalizedEmail);

    // Send email
    const result = await sendOTPEmail(normalizedEmail, otp);
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const cooldown = getResendCooldown(normalizedEmail);

    return res.json({
      success: true,
      message: 'Verification code sent to your email.',
      cooldownSeconds: cooldown,
      ...(result.devMode && { devOtp: otp }),
    });
  } catch (err) {
    console.error('OTP send error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/otp/verify
 * Body: { email: string, otp: string }
 * Verifies the OTP for the given email.
 */
router.post('/verify', verifyLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    if (!otp || typeof otp !== 'string') {
      return res.status(400).json({ success: false, error: 'OTP is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!/^\d{6}$/.test(trimmedOtp)) {
      return res.status(400).json({ success: false, error: 'OTP must be a 6-digit number.' });
    }

    const result = verifyOTP(normalizedEmail, trimmedOtp);

    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      message: 'Email verified successfully!',
      email: normalizedEmail,
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/otp/resend
 * Body: { email: string }
 * Resends OTP with cooldown check.
 */
router.post('/resend', sendLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const check = canSendOTP(normalizedEmail);
    if (!check.allowed) {
      return res.status(429).json({
        success: false,
        error: check.reason,
        cooldownSeconds: getResendCooldown(normalizedEmail),
      });
    }

    const otp = storeOTP(normalizedEmail);
    const result = await sendOTPEmail(normalizedEmail, otp);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const cooldown = getResendCooldown(normalizedEmail);

    return res.json({
      success: true,
      message: 'New verification code sent to your email.',
      cooldownSeconds: cooldown,
      ...(result.devMode && { devOtp: otp }),
    });
  } catch (err) {
    console.error('OTP resend error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

module.exports = router;
