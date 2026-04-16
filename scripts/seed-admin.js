const mongoose = require('mongoose');
const User = require('../src/modules/user/user.model');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = await User.create({
            username: 'admin',
            password: 'adminpassword', // Change this after first login
            role: 'admin',
            permissions: [] // Admins bypass permission checks
        });

        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: adminpassword');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
