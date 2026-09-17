const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const seedData = require('./seed/seeder');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CareWave Health Systems',
    tagline: 'Smarter Queues, Faster Care',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/queue', require('./routes/queueRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/stats', require('./routes/notificationRoutes')); // Alias for /api/stats/stats

// 404 & Error Handler
app.use(notFound);
app.use(errorHandler);

// Bootstrap Server & Database
const startServer = async () => {
  try {
    // Attempt DB connection (with built-in fallback)
    await connectDB();
    
    // Auto-seed sample Indian hospitals, demo doctors, and test patient account
    await seedData();

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🏥 CAREWAVE API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`🩺 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();
