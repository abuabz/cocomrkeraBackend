const app = require('./app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');

// Connect to Database and Start Server
const startServer = async () => {
    const PORT = env.PORT;
    
    // Start listening immediately so Render sees the app as "Live"
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🌍 Environment: ${env.NODE_ENV}`);
        
        // Connect to database in the background
        connectDB();
    });
};

startServer();
