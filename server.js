const app = require('./app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const PORT = env.PORT;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
});
