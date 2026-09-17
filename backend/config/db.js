const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

// Path for local resilient persistent store fallback
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'local_db.json');

// In-memory / file-backed fallback store
let memoryStore = {
  users: [],
  hospitals: [],
  doctors: [],
  appointments: [],
  queues: [],
  notifications: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load existing local DB file if present
function loadLocalStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      if (content.trim()) {
        memoryStore = JSON.parse(content);
      }
    }
  } catch (err) {
    console.warn('[CareWave DB] Could not read local fallback store file, initializing fresh store:', err.message);
  }
}

// Save local DB file
function saveLocalStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('[CareWave DB] Error persisting fallback store:', err.message);
  }
}

loadLocalStore();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carewave';
  try {
    console.log(`[CareWave DB] Attempting connection to MongoDB at: ${uri}`);
    mongoose.set('strictQuery', false);
    
    // Connect with a 3 second timeout so the server doesn't hang if MongoDB is offline
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`[CareWave DB] MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[CareWave DB] MongoDB connection could not be established (${error.message}).`);
    console.log('[CareWave DB] Activating CareWave Resilient Storage Engine (Zero-Friction In-Memory/File Persistence mode).');
    console.log('[CareWave DB] All operations, bookings, users, and queues will function seamlessly!');
    return false;
  }
};

const getStore = () => memoryStore;
const isUsingMongo = () => isMongoConnected;

module.exports = {
  connectDB,
  getStore,
  saveLocalStore,
  isUsingMongo
};
