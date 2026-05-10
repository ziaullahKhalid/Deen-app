/**
 * In-memory OTP store with automatic cleanup.
 * For production, replace with Redis or a database.
 */

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_EMAIL = 5; // per hour
const SEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Map<email, { otp, expiresAt, attempts, verified, createdAt }>
const otpMap = new Map();

// Map<email, { timestamps[] }> for rate limiting sends
const sendHistory = new Map();

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function canSendOTP(email) {
  const history = sendHistory.get(email);
  if (!history) return { allowed: true };

  const now = Date.now();
  // Clean old entries
  history.timestamps = history.timestamps.filter((t) => now - t < SEND_WINDOW_MS);

  if (history.timestamps.length >= MAX_SENDS_PER_EMAIL) {
    return { allowed: false, reason: 'Too many OTP requests. Please try again in 1 hour.' };
  }

  // Check cooldown
  const existing = otpMap.get(email);
  if (existing && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    return { allowed: false, reason: `Please wait ${waitSec} seconds before requesting a new OTP.` };
  }

  return { allowed: true };
}

function storeOTP(email) {
  const otp = generateOTP();
  const now = Date.now();

  otpMap.set(email, {
    otp,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    verified: false,
    createdAt: now,
  });

  // Track send history
  if (!sendHistory.has(email)) {
    sendHistory.set(email, { timestamps: [] });
  }
  sendHistory.get(email).timestamps.push(now);

  return otp;
}

function verifyOTP(email, inputOtp) {
  const record = otpMap.get(email);

  if (!record) {
    return { valid: false, error: 'No OTP found. Please request a new one.' };
  }

  if (record.verified) {
    return { valid: false, error: 'This OTP has already been used. Please request a new one.' };
  }

  if (Date.now() > record.expiresAt) {
    otpMap.delete(email);
    return { valid: false, error: 'OTP has expired. Please request a new one.' };
  }

  record.attempts += 1;

  if (record.attempts > MAX_ATTEMPTS) {
    otpMap.delete(email);
    return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' };
  }

  if (record.otp !== inputOtp) {
    const remaining = MAX_ATTEMPTS - record.attempts;
    return { valid: false, error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` };
  }

  // Mark as verified (single-use)
  record.verified = true;
  return { valid: true };
}

function getResendCooldown(email) {
  const record = otpMap.get(email);
  if (!record) return 0;
  const elapsed = Date.now() - record.createdAt;
  if (elapsed >= RESEND_COOLDOWN_MS) return 0;
  return Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
}

// Cleanup expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpMap.entries()) {
    if (now > record.expiresAt + 60000) {
      otpMap.delete(email);
    }
  }
  for (const [email, history] of sendHistory.entries()) {
    history.timestamps = history.timestamps.filter((t) => now - t < SEND_WINDOW_MS);
    if (history.timestamps.length === 0) {
      sendHistory.delete(email);
    }
  }
}, 10 * 60 * 1000);

module.exports = {
  generateOTP,
  canSendOTP,
  storeOTP,
  verifyOTP,
  getResendCooldown,
  OTP_EXPIRY_MS,
  RESEND_COOLDOWN_MS,
};
