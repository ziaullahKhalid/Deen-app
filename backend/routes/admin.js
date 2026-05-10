const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const { canSendOTP, storeOTP, verifyOTP } = require('../store/otpStore');
const { sendOTPEmail } = require('../services/emailService');

const router = express.Router();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'ziakhalid1045@gmail.com').toLowerCase();
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'deen_app_admin_secret_2026';
const JWT_EXPIRY = '24h';

// In-memory admin data store
const adminStore = {
  users: [
    { id: 1, name: 'Zia Khalid', email: 'ziakhalid1045@gmail.com', role: 'admin', status: 'active', joined: '2026-01-15', posts: 24, avatar: '👑' },
    { id: 2, name: 'Ahmad Hassan', email: 'ahmad@example.com', role: 'user', status: 'active', joined: '2026-02-10', posts: 18, avatar: '🧔' },
    { id: 3, name: 'Fatima Ali', email: 'fatima@example.com', role: 'user', status: 'active', joined: '2026-02-22', posts: 31, avatar: '👩' },
    { id: 4, name: 'Omar Sheikh', email: 'omar@example.com', role: 'moderator', status: 'active', joined: '2026-03-05', posts: 12, avatar: '🧑' },
    { id: 5, name: 'Khadija Noor', email: 'khadija@example.com', role: 'user', status: 'suspended', joined: '2026-03-18', posts: 7, avatar: '👩' },
    { id: 6, name: 'Yusuf Khan', email: 'yusuf@example.com', role: 'user', status: 'active', joined: '2026-04-01', posts: 45, avatar: '🧔' },
    { id: 7, name: 'Aisha Mahmood', email: 'aisha@example.com', role: 'user', status: 'active', joined: '2026-04-12', posts: 9, avatar: '👩' },
    { id: 8, name: 'Ibrahim Saeed', email: 'ibrahim@example.com', role: 'user', status: 'banned', joined: '2026-04-20', posts: 2, avatar: '🧑' },
  ],
  reports: [
    { id: 1, type: 'post', reporter: 'Ahmad Hassan', reason: 'Inappropriate content', status: 'pending', date: '2026-05-08' },
    { id: 2, type: 'user', reporter: 'Fatima Ali', reason: 'Spam account', status: 'pending', date: '2026-05-07' },
    { id: 3, type: 'comment', reporter: 'Omar Sheikh', reason: 'Hate speech', status: 'resolved', date: '2026-05-06' },
    { id: 4, type: 'post', reporter: 'Khadija Noor', reason: 'Copyright violation', status: 'pending', date: '2026-05-05' },
  ],
  otpLogs: [],
};

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Admin access denied.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

// Serve admin login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

// Serve admin dashboard page
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

// Admin OTP login - send OTP
router.post('/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Access denied. Only admin email is allowed.' });
    }

    const check = canSendOTP(normalizedEmail);
    if (!check.allowed) {
      return res.status(429).json({ success: false, error: check.reason });
    }

    const otp = storeOTP(normalizedEmail);
    const result = await sendOTPEmail(normalizedEmail, otp);

    adminStore.otpLogs.push({
      email: normalizedEmail,
      time: new Date().toISOString(),
      devMode: result.devMode || false,
    });

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      message: 'Admin verification code sent.',
      ...(result.devMode && { devOtp: otp }),
    });
  } catch (err) {
    console.error('Admin OTP error:', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Admin OTP login - verify and get JWT
router.post('/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP required.' });

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    const result = verifyOTP(normalizedEmail, otp.trim());
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.error });
    }

    const token = jwt.sign({ email: normalizedEmail, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return res.json({
      success: true,
      message: 'Admin login successful!',
      token,
      admin: { email: normalizedEmail, role: 'admin' },
    });
  } catch (err) {
    console.error('Admin verify error:', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// ---- Protected Admin API Endpoints ----

// Dashboard stats
router.get('/api/stats', authMiddleware, (req, res) => {
  const active = adminStore.users.filter(u => u.status === 'active').length;
  const suspended = adminStore.users.filter(u => u.status === 'suspended').length;
  const banned = adminStore.users.filter(u => u.status === 'banned').length;
  const pendingReports = adminStore.reports.filter(r => r.status === 'pending').length;
  const totalPosts = adminStore.users.reduce((sum, u) => sum + u.posts, 0);

  res.json({
    success: true,
    stats: {
      totalUsers: adminStore.users.length,
      activeUsers: active,
      suspendedUsers: suspended,
      bannedUsers: banned,
      totalPosts,
      totalReports: adminStore.reports.length,
      pendingReports,
      otpsSent: adminStore.otpLogs.length,
    },
  });
});

// List users
router.get('/api/users', authMiddleware, (req, res) => {
  res.json({ success: true, users: adminStore.users });
});

// Update user status
router.put('/api/users/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const userId = parseInt(req.params.id, 10);
  const user = adminStore.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
  if (!['active', 'suspended', 'banned'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status.' });
  }
  user.status = status;
  res.json({ success: true, message: `User ${user.name} is now ${status}.`, user });
});

// Update user role
router.put('/api/users/:id/role', authMiddleware, (req, res) => {
  const { role } = req.body;
  const userId = parseInt(req.params.id, 10);
  const user = adminStore.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
  if (!['admin', 'moderator', 'user'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role.' });
  }
  user.role = role;
  res.json({ success: true, message: `${user.name} role updated to ${role}.`, user });
});

// Delete user
router.delete('/api/users/:id', authMiddleware, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const idx = adminStore.users.findIndex(u => u.id === userId);
  if (idx === -1) return res.status(404).json({ success: false, error: 'User not found.' });
  if (adminStore.users[idx].email === ADMIN_EMAIL) {
    return res.status(403).json({ success: false, error: 'Cannot delete admin account.' });
  }
  const deleted = adminStore.users.splice(idx, 1)[0];
  res.json({ success: true, message: `${deleted.name} has been deleted.` });
});

// List reports
router.get('/api/reports', authMiddleware, (req, res) => {
  res.json({ success: true, reports: adminStore.reports });
});

// Update report status
router.put('/api/reports/:id', authMiddleware, (req, res) => {
  const { status } = req.body;
  const reportId = parseInt(req.params.id, 10);
  const report = adminStore.reports.find(r => r.id === reportId);
  if (!report) return res.status(404).json({ success: false, error: 'Report not found.' });
  report.status = status;
  res.json({ success: true, message: `Report marked as ${status}.`, report });
});

// OTP logs
router.get('/api/otp-logs', authMiddleware, (req, res) => {
  res.json({ success: true, logs: adminStore.otpLogs });
});

// App settings
router.get('/api/settings', authMiddleware, (req, res) => {
  res.json({
    success: true,
    settings: {
      appName: 'Deen App',
      version: '2.0.0',
      otpExpiry: '5 minutes',
      resendCooldown: '60 seconds',
      maxAttempts: 5,
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: process.env.SMTP_PORT || '587',
      smtpUser: process.env.SMTP_USER || 'ziakhalid1045@gmail.com',
      smtpConfigured: !!process.env.SMTP_PASS,
      adminEmail: ADMIN_EMAIL,
    },
  });
});

module.exports = router;
