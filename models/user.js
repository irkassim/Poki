const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  refreshToken: { type: String },
  Occupation: { type: String },
  favorites: { type: String },
  
  gender: { type: String, enum: ['Male', 'Female', 'Non-Binary', 'Other'], default: 'Other' },
  dateOfBirth: { type: Date, required: true },
  avatar: { type: String, default: '/default-avatar.png' },
  
  favoriteMovies: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.every((movie) => typeof movie === 'string' && movie.length <= 100),
      message: 'Each movie name must be a string with a maximum length of 100 characters.',
    },
  },
  favoriteSongs: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.every((song) => typeof song === 'string' && song.length <= 100),
      message: 'Each song name must be a string with a maximum length of 100 characters.',
    },
  },
  
  hobbies: {
    type: [String],
    enum: [
      'sports', 'movies', 'music', 'art', 'literature',
      'fashion', 'cuisine', 'travel', 'Gaming', 
      'Gym/Fitness', 'Nerd', 'Volunteering', 'photography',
    ],
    default: [],
  },
  favorite: {
    category: { type: String, enum: ["song", "movie", "series", "celebrity", "book", "politician", "thing"] },
    value: { type: String },
  },
  
  
  education: {
    type: String,
    enum: [
      'Bachelors', 'Masters', 'In College', 'High School',
      'PhD', 'In Grad School', 'Trade School',
    ],
  },
  
  datingGoals: {
    type: String,
    enum: [
      'Marriage: Traditional Roles', 
      'Marriage: 50/50',
      'Long-term', 'Open-minded',
      'Short-term Fun', 'Not Sure',
    ],
  },
  
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accountType: { type: String, enum: ['Basic', 'Daily', 'Premium'], default: 'Basic' },
  subscriptionExpiresAt: { type: Date },
  boostsUsedToday: { type: Number, default: 0 },
  matchesUsedToday: { type: Number, default: 0 },
  pokesUsedToday: { type: Number, default: 0 },
  exploreUsedToday: { type: Boolean, default: false },
  zodiacSigns: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.every((sign) => typeof sign === 'string'),
      message: 'Each zodiac sign must be a string.',
    },
  },


  publicPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  memories: [
    {
      url: { type: String },
      isHidden: { type: Boolean, default: false },
      sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
  ],
  isProfileComplete: { type: Boolean, default: false },
  preference: { type: String, enum: ['Men', 'Women', 'Everyone'], default: 'Everyone' },
  
  location: {
    type: {
      type: String, // "Point"
      enum: ['Point'],
      required: function () {
        return this.location?.coordinates?.length === 2;
      },
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: (v) => v.length === 2,
        message: 'Coordinates must be an array of two numbers [longitude, latitude].',
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Virtual field for hidden memory count
userSchema.virtual('hiddenMemoriesCount').get(function () {
  return this.memories.filter((memory) => memory.isHidden).length;
});

module.exports = mongoose.model('User', userSchema);


