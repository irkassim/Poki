// controllers/peopleController.js
const Photo = require('../models/Photo'); 
const User = require('../models/user');
const { calculateDistance } = require('../utils/proximity');
const mongoose = require('mongoose');
const getSignedUrls=require("../services/getSignedUrls")


const {matchUsers } = require('../services/matchService');

exports.getPeople = async (req, res) => {
  try {
    //const { userId, latitude, longitude } = req.query;
    const { userId, latitude, longitude, page = 1, limit = 10 } = req.query;

    console.log("Theperson:", userId, latitude,longitude)

    // Validate `userId` and ensure it's a single string
    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ error: 'Invalid userId. It must be a single string.' });
      }

      // Validate and cast `userId`
   /*  let userObjectId;
    try {
      userObjectId = mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid userId format.' });
    } */

    // Validate inputs
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    // Fetch current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fetch all users except the current user
    const allUsers = await User.find({ _id: { $ne: userId } });

    // Match users based on logic
    const matchedUsers = matchUsers(currentUser, allUsers, {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    
    //pagination
    const startIndex = (page - 1) * limit;
    const paginatedUsers = matchedUsers.slice(startIndex, startIndex + limit);


    //FetchSignedUrls
    // Fetch public photos and generate signed URLs
    // Fetch public photos and generate signed URLs
    const usersWithPhotos = await Promise.all(
        paginatedUsers.map(async ({ user }) => {
          if (user.publicPhotos && user.publicPhotos.length > 0) {
            const photoDocs = await Photo.find({ _id: { $in: user.publicPhotos } });
            const photoKeys = photoDocs.map((photo) => photo.key);
            const signedUrls = await getSignedUrls(photoKeys);
           // console.log("signedUrls:", signedUrls)
            return { ...user.toObject(), publicPhotos: signedUrls };
          }
          return { ...user.toObject(), publicPhotos: [] }; // No photos
        })
      );
  
      

   // res.json(matchedUsers.map(({ user }) => user)); // Return matched users
    // Remove duplicates based on user IDs
    const uniqueUsers = Array.from(new Map(usersWithPhotos.map((user) => [user._id, user])).values());

   res.json({
    //users: paginatedUsers.map(({ user }) => user),//unwrap the users
    users: uniqueUsers,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(matchedUsers.length / limit),
  });

  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// module.exports = { getPeople }; 
