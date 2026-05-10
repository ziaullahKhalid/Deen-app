require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const otpRoutes = require('./routes/otp');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Serve static files for admin panel
app.use('/admin/static', express.static(path.join(__dirname, 'public/admin')));

// Global rate limiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// API routes
app.use('/api/otp', otpRoutes);

// Admin panel routes
app.use('/admin', adminRoutes);

// Redirect /admin to /admin/login
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Deen App OTP Backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Deen App OTP Backend running on port ${PORT}`);
});

module.exports = app;
