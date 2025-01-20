const mongoose = require('mongoose');
const  getZodiacSign = require('../utils/zodiacs');


const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  refreshToken: { type: String },
  occupation: { type: String },
  userZodiac: { type: [String], default: [] }, // Signs they're interested in
 
  gender: { type: String, enum: ['Male', 'Female', 'Non-Binary', 'Other','gender'], default: 'gender' },
  dateOfBirth: { type: Date, required: true },
  avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }, 
  
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
      'Sports', 'Movies', 'Music', 'Art', 'Literature',
      'Fashion', 'Cuisine', 'Travel', 'Gaming', 
      'Gym/Fitness', 'Nerd', 'Volunteering', 'Photography',
      
    ],
    default: [],
    validate: {
      validator: function (value) {
        // Ensure no duplicates (case-insensitive)
        const lowerCaseHobbies = value.map((v) => v.toLowerCase());
        return new Set(lowerCaseHobbies).size === lowerCaseHobbies.length;
      },
      message: 'Duplicate hobbies are not allowed.',
    },
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
  // New field for user preferences
  compatibilityTest: {
    responses: [
      {
        category: { type: String, enum: ['Personality', 'Values', 'Mindset'], required: true },
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: { type: Number, required: true }, // Assume answers are on a scale (e.g., 1-5)
      },
    ],
    completionStatus: { type: Boolean, default: false }, // Whether the user completed the test
  },
  
  userPreferences: {
    maxDistance: {
      type: Number,
      default: 50, // Default maximum distance (e.g., 50 km)
      min: [3, 'Minimum distance is 3 km'], // Minimum value
      max: [199, 'Maximum distance is 199 km'], // Maximum value
    },
    ageRange: {
      type: {
        min: {
          type: Number,
          default: 18, // Default minimum age
          min: [18, 'Minimum age is 18'], // Minimum value
          max: [100, 'Maximum age is 100'], // Ensure valid age range
        },
        max: {
          type: Number,
          default: 30, // Default maximum age
          min: [18, 'Minimum age is 18'], // Ensure valid age range
          max: [100, 'Maximum age is 100'], // Maximum value
        },
      },
      validate: {
        validator: function (v) {
          // Ensure minAge <= maxAge
          return v.min <= v.max;
        },
        message: 'Minimum age must be less than or equal to maximum age',
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Virtual field for hidden memory count
userSchema.virtual('hiddenMemoriesCount').get(function () {
  return this.memories.filter((memory) => memory.isHidden).length;
});

// Pre-save middleware to calculate and set userZodiac
/* userSchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    this.userZodiac = getZodiacSign(this.dateOfBirth);
  }
  next();
}); */

module.exports = mongoose.model('User', userSchema);


