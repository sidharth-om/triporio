const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed admin user if not exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: 'admin@triporio.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@triporio.com',
        phone: '9876543210',
        password: 'admin123456',
        role: 'admin',
      });
      console.log('✅ Default Admin user auto-created in production DB');
    }
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
