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

// Enable CORS for all origins in development and production (e.g. *.vercel.app)
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazily ensure DB and seed data are initialized (supports both local server and Vercel serverless)
let initPromise = null;
const ensureInitialized = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await connectDB();
        await seedData();
      } catch (err) {
        console.error('[CareWave Init Error]:', err.message);
      }
    })();
  }
  return initPromise;
};

app.use(async (req, res, next) => {
  await ensureInitialized();
  next();
});

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
app.use('/api/stats', require('./routes/notificationRoutes'));

// 404 & Error Handler
app.use(notFound);
app.use(errorHandler);

// Bootstrap Server if running directly (local or non-serverless container)
const startServer = async () => {
  try {
    await ensureInitialized();

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

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
