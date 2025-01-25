const Photo = require('../models/Photo');
const User = require('../models/user');
//const { calculateDistance } = require('../utils/proximity');
const getSignedUrls = require('../services/getSignedUrls');
const { matchUsers } = require('../services/matchService');

exports.getPeople = async (req, res) => {
  try {
    const { userId, latitude, longitude, page = 1, limit = 10 } = req.query;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const allUsers = await User.find({ _id: { $ne: userId } });

    // Match users based on logic
    const matchedUsers = await matchUsers(currentUser, allUsers, {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    console.log("Matched Users:", matchedUsers);

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedUsers = matchedUsers.slice(startIndex, startIndex + limit);

    // Fetch public photos and generate signed URLs
    const usersWithPhotos = await Promise.all(
      paginatedUsers.map(async ({ user }) => {
        if (user.publicPhotos && user.publicPhotos.length > 0) {
          const photoDocs = await Photo.find({ _id: { $in: user.publicPhotos } });
          const photoKeys = photoDocs.map((photo) => photo.key);
          const signedUrls = await getSignedUrls(photoKeys);
          return { ...user.toObject(), publicPhotos: signedUrls };
        }
        return { ...user.toObject(), publicPhotos: [] };
      })
    );

    // Remove duplicates based on user IDs
    const uniqueUsers = Array.from(new Map(usersWithPhotos.map((user) => [user._id, user])).values());

    res.json({
      users: uniqueUsers,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(matchedUsers.length / limit),
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
