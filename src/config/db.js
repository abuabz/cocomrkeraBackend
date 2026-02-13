const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    try {
        const uri = env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        // Mask URI for logging (hide username/password)
        const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
        console.log(`Connecting to MongoDB: ${maskedUri}`);

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        throw error; // Rethrow to be handled by startServer
    }
};

module.exports = connectDB;
