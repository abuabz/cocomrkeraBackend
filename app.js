const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/env');
const errorHandler = require('./src/middlewares/error.middleware');
const notFoundHandler = require('./src/middlewares/notFound.middleware');

// Initialize app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(helmet()); // Temporarily disabled to rule out CSP issues
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Coconut Backend API', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
    const dbStatus = require('mongoose').connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({ 
        status: 'healthy', 
        database: states[dbStatus] || 'unknown',
        timestamp: new Date().toISOString() 
    });
});

// Module Routes
const customerRoutes = require('./src/modules/customer/customer.routes');
const employeeRoutes = require('./src/modules/employee/employee.routes');
const followupRoutes = require('./src/modules/followup/followup.routes');
const saleRoutes = require('./src/modules/sale/sale.routes');
const orderRoutes = require('./src/modules/order/order.routes');
const statsRoutes = require('./src/modules/stats/stats.routes');

app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

module.exports = app;
