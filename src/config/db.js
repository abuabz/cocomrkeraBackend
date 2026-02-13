const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    try {
        let uri = env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        // Clean the URI (remove accidental spaces or quotes)
        uri = uri.trim().replace(/^["']|["']$/g, '');
        
        // Mask URI for logging (hide username/password)
        const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
        console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

        const conn = await mongoose.connect(uri);
        console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`🔴 Database Connection Error: ${error.message}`);
        // Do not rethrow here, let the server stay alive so we can see the error in logs
        return false;
    }
};

module.exports = connectDB;
