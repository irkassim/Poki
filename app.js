//Begin
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./utils/logger');
const { mongodb_connection } = require("./config/database");
const { uploadFields } = require('./middleware/multerConfig');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Database connection
mongodb_connection().then(() => {
  console.log("App is connected to database");
}).catch((error) => {
  console.error("Database connection error:", error);
});

// Handle preflight requests
//app.options('*', cors());

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Include headers your app uses
}));

//app.use(uploadFields); // Handle multipart/form-data
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(logger); // Log HTTP requests

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Import Routes
const authRoutes = require('./routes/authRoute');
const matchRoutes = require('./routes/matchRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const profileRoutes = require('./routes/profileRoute')
const pokeRoutes = require("./routes/pokeRoute")
const messageRoutes = require("./routes/messageRoutes")
const homePageRoutes = require("./routes/homePageRoutes")
const blockRoutes = require("./routes/blockRoutes")
const peopleRoute = require("./routes/peopleRoute")
const questionRoute = require("./routes/questionRoute")

// API Routes
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/match', matchRoutes);       // Matchmaking routes
app.use('/api/memory', memoryRoutes);     // Memory upload routes
app.use('/api/location', locationRoutes); // Location-based routes
app.use('/api/profile', profileRoutes); // Profile routes
app.use('/api/pokes', pokeRoutes); //poking route
app.use('/api/message', messageRoutes); //messages route
app.use('/api/users', peopleRoute); //messages route
app.use('/api/compatibility', questionRoute); //messages route

app.use('/api/home',  homePageRoutes); //homepage route
//app.use('/api/block', blockRoutes); //blocking route

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Poki backend is running!' });
});

// Fallback for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

module.exports = app;
