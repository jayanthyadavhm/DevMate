const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
require('dotenv').config();

const app = express();

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'devmate-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/server.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ],
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting - More generous for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs (increased from 100)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
application.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/hackathons', require('./routes/hackathons'));
app.use('/api/hackathon-teams', require('./routes/hackathonTeams'));

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

        logger.info('MongoDB connected');
    } catch (err) {
        logger.error('MongoDB connection error:', err);
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
