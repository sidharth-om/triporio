const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminExists = await User.findOne({ email: 'admin@triporio.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@triporio.com',
      phone: '9876543210',
      password: 'admin123456',
      role: 'admin',
    });

    console.log('✅ Admin user created:');
    console.log('   Email: admin@triporio.com');
    console.log('   Password: admin123456');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
