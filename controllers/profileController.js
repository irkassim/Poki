const { validationResult } = require('express-validator');
const AWS = require('aws-sdk');
const User = require('../models/user');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

//Update profile
exports.updateProfile = async (req, res) => {
  if (!req.files?.avatar && !req.body.bio && !req.body.gender) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }
  try {
    const userId = req.user.id; // Extract user ID from the token
    const updates = req.body; // The fields to update
    console.log('Body:', req.body);
    console.log('File:', req.files?.avatar); // Access uploaded avatar file

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle avatar upload
    if (req.files?.avatar) {
      const avatarFile = req.files.avatar[0]; // Access the first file in the array
      console.log("AvatarFile:", avatarFile);

      // Define S3 upload parameters
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `profile/${Date.now()}-${avatarFile.originalname}`,
        Body: avatarFile.buffer, // File buffer from Multer
        ContentType: avatarFile.mimetype, // File type
      };

      // Upload to S3
      const uploadResult = await s3.upload(params).promise();
      console.log('S3 Upload Result:', uploadResult);

      // Save the uploaded S3 URL to the user's avatar field
      user.avatar = uploadResult.Location;
    }

    // Apply updates to the user document
    Object.keys(updates).forEach((key) => {
      if (key === 'hiddenAttributes' && typeof updates[key] === 'object') {
        user.hiddenAttributes = user.hiddenAttributes || {};
        Object.assign(user.hiddenAttributes, updates[key]);
      } else if (key === 'memories' && Array.isArray(updates[key])) {
        user.memories = user.memories || [];
        user.memories.push(...updates[key]);
      } else {
        user[key] = updates[key];
      }
    });

    // Save the updated user
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};


//Get Profile however the route is a post
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the middleware
    console.log("User:",req.user.id )

    if (!req.user.id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const user = await User.findById(userId).select(
      ' email firstName lastName bio avatar favoriteMovies favoriteSongs location boostsUsedToday pokesUsedToday matchesUsedToday, exploreUsedToday'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

