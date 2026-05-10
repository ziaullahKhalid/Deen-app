/**
 * OTP Service - Connects to the Deen App OTP backend.
 * In dev mode (no backend running), falls back to local simulation.
 */

const API_BASE = __DEV__
  ? 'http://10.0.2.2:3001/api/otp' // Android emulator -> host machine
  : 'https://your-production-api.com/api/otp';

// For web testing, use localhost
const WEB_API_BASE = 'http://localhost:3001/api/otp';

function getBaseURL() {
  if (typeof window !== 'undefined' && window.location) {
    return WEB_API_BASE;
  }
  return API_BASE;
}

// Local fallback for dev/testing when backend is not running
let localOtpStore = {};

async function sendOTP(email) {
  try {
    const response = await fetch(`${getBaseURL()}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    // Fallback to local OTP for testing without backend
    console.log('[OTP] Backend not available, using local OTP');
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    localOtpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000, verified: false };
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return {
      success: true,
      message: 'Verification code sent (dev mode).',
      cooldownSeconds: 60,
      devOtp: otp,
    };
  }
}

async function verifyOTP(email, otp) {
  try {
    const response = await fetch(`${getBaseURL()}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    // Fallback to local verification
    console.log('[OTP] Backend not available, using local verification');
    const record = localOtpStore[email];
    if (!record) {
      return { success: false, error: 'No OTP found. Please request a new one.' };
    }
    if (record.verified) {
      return { success: false, error: 'OTP already used.' };
    }
    if (Date.now() > record.expiresAt) {
      delete localOtpStore[email];
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    if (record.otp !== otp) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    record.verified = true;
    return { success: true, message: 'Email verified successfully!' };
  }
}

async function resendOTP(email) {
  try {
    const response = await fetch(`${getBaseURL()}/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    // Fallback
    return sendOTP(email);
  }
}

export { sendOTP, verifyOTP, resendOTP };
