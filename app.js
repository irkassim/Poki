const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./utils/logger');
const { mongodb_connection } = require("./config/database");
const { uploadFields } = require('./middleware/multerConfig');
const path = require('path');


// Import Routes
const authRoutes = require('./routes/authRoute');
const matchRoutes = require('./routes/matchRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const profileRoutes = require('./routes/profileRoute')
const pokeRoutes = require("./routes/pokeRoute")
const messageRoutes = require("./routes/messageRoutes")
const blockRoutes = require("./routes/messageRoutes")

mongodb_connection().then(() => {
    console.log("App is connected to database");
  });

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(uploadFields); // Handle multipart/form-data
app.use(express.json()); // Parse JSON request bodies

// Middleware for parsing `multipart/form-data`
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Allow requests from the frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // Allow only frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // Allow cookies if needed
}));
app.use(logger); // Log HTTP requests

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/match', matchRoutes);       // Matchmaking routes
app.use('/api/memory', memoryRoutes);     // Memory upload routes
app.use('/api/location', locationRoutes); // Location-based routes
app.use('/api/profile', profileRoutes); // Profile routes
app.use('/api/pokes', pokeRoutes); //poking route
app.use('/api/message', messageRoutes); //poking route
app.use('/api/block', blockRoutes); //poking route

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Poki backend is running!' });
});

// Fallback for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });



module.exports = app;