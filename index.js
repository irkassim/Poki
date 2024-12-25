// Backend: Node.js with Express
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware
app.use(express.json());
app.use(cors());

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poki_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  limitedProfile: { bio: String, avatar: String },
  fullProfile: { phone: String, socialLinks: [String] },
  hiddenAttributes: {
    memories: [String], // S3 URLs to pictures/videos
    favoriteSongs: [String],
    favoriteMovies: [String],
  },
  sharedAttributes: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      sharedMemories: [String], // S3 URLs to shared pictures/videos
      sharedSongs: [String],
      sharedMovies: [String],
    },
  ],
  pokes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matchLevel: {
    type: String,
    enum: ['silver', 'gold', 'platinum'],
    default: 'silver',
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, // [longitude, latitude]
  },
  notifications: [{
    type: { type: String }, // e.g., 'poke', 'match', 'message'
    message: String,
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],
});

const User = mongoose.model('User', userSchema);

// Authentication Middleware
/* const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
 */





// Advanced Matchmaking Algorithm with Geolocation
app.get('/match-suggestions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const suggestions = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: user.location.coordinates },
          distanceField: 'distance',
          maxDistance: 50000, // 50 km radius
          spherical: true,
        },
      },
      {
        $match: {
          _id: { $ne: user._id },
        },
      },
      {
        $addFields: {
          score: {
            $sum: [
              { $cond: [{ $eq: ['$limitedProfile.bio', user.limitedProfile.bio] }, 5, 0] },
              { $size: { $setIntersection: ['$hiddenAttributes.favoriteMovies', user.hiddenAttributes.favoriteMovies] } },
              { $size: { $setIntersection: ['$hiddenAttributes.favoriteSongs', user.hiddenAttributes.favoriteSongs] } },
              { $cond: [{ $eq: ['$matchLevel', user.matchLevel] }, 10, 0] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch match suggestions' });
  }
});

// Real-Time Typing Indicator
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their room`);
  });

  socket.on('typing', ({ toUserId, fromUserId }) => {
    io.to(toUserId.toString()).emit('typing', { fromUserId });
  });

  socket.on('stop-typing', ({ toUserId, fromUserId }) => {
    io.to(toUserId.toString()).emit('stop-typing', { fromUserId });
  });

  socket.on('message', async ({ fromUserId, toUserId, message }) => {
    io.to(toUserId.toString()).emit('message', { fromUserId, message });
    await sendNotification(toUserId, 'message', message, fromUserId);
  });

  socket.on('delivery-confirmation', ({ fromUserId, toUserId }) => {
    io.to(fromUserId.toString()).emit('delivery-confirmation', { toUserId });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Fetch Notifications
app.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'notifications').populate('notifications.fromUser', 'username');
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Send Notification
const sendNotification = async (toUserId, type, message, fromUserId) => {
  const user = await User.findById(toUserId);
  user.notifications.push({
    type,
    message,
    fromUser: fromUserId,
  });
  await user.save();

  io.to(toUserId.toString()).emit('notification', {
    type,
    message,
    fromUserId,
  });
};

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
