require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Initialize Express App
const application = express();

// Logger Configuration using Winston
const logHandler = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/activity.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
});

// Global Middlewares
application.use(cors());
application.use(helmet());
application.use(express.json());
application.use(compression());
application.use(morgan('dev'));

// API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Rate limit exceeded. Please try again after some time.'
});
application.use('/api', apiLimiter);

// Routes Registration
application.use('/api/auth', require('./routes/auth'));
application.use('/api/projects', require('./routes/projects'));
application.use('/api/tasks', require('./routes/tasks'));

// Global Error Middleware
application.use((error, req, res, next) => {
    logHandler.error(error.message, { stack: error.stack });
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Something went wrong on the server'
    });
});

// MongoDB Connection Logic
const initializeDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('Missing MONGODB_URI in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logHandler.info('Successfully connected to MongoDB');
    } catch (dbError) {
        logHandler.error('Failed to connect to MongoDB:', dbError.message);
        process.exit(1);
    }
};

initializeDB();

// Launch Server
const APP_PORT = process.env.PORT || 5000;
const runningServer = application.listen(APP_PORT, () => {
    logHandler.info(`Server started and listening on port ${APP_PORT}`);
});

// Handle Graceful Shutdown
process.on('SIGTERM', () => {
    logHandler.info('Received SIGTERM. Initiating shutdown...');
    runningServer.close(() => {
        logHandler.info('HTTP server closed.');
        mongoose.connection.close(false, () => {
            logHandler.info('MongoDB connection closed gracefully.');
            process.exit(0);
        });
    });
});
