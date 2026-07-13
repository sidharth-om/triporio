const dotenv = require('dotenv');
dotenv.config();

// Force IPv4 DNS resolution first (Render free tier blocks outbound IPv6)
const dns = require('dns');
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  console.warn('⚠️ Failed to set DNS result order:', e.message);
}

// Fix local DNS resolution issues for MongoDB SRV records on some environments (e.g. Windows/WSL/local ISP resolvers)
if (process.env.NODE_ENV === 'development') {
  const servers = dns.getServers();
  if (servers.length === 0 || servers.some(s => s.startsWith('127.') || s === '::1')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
      console.log('ℹ️ Local DNS resolver detected. Node.js DNS servers set to public DNS (8.8.8.8, 8.8.4.4, 1.1.1.1).');
    } catch (e) {
      console.warn('⚠️ Failed to configure public DNS servers:', e.message);
    }
  }
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Explore North Kerala API is running 🌴' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
