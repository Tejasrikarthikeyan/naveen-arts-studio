require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@naveenink.com' });
    if (existing) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    const hash = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@naveenink.com',
      password: hash
    });

    await admin.save();
    console.log('Admin seeded successfully! Email: admin@naveenink.com, Pass: admin123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
