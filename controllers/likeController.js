const Photo = require('../models/photoModel');

const User = require('../models/user');

exports.likeProfile = async (req, res) => {
  try {
    const likerId = req.user.id; // Liking user
    const { likedUserId } = req.body;

    if (!likedUserId) {
      return res.status(400).json({ error: 'User to like is required.' });
    }

    const liker = await User.findById(likerId);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the liker has already liked this profile
    const alreadyLiked = likedUser.likesReceived.some((like) => like.user.toString() === likerId);
    if (alreadyLiked) {
      return res.status(400).json({ error: 'You already liked this profile.' });
    }

    // Check daily like limits
    if (
      liker.accountType === 'Basic' && liker.likesGivenToday >= 5 ||
      liker.accountType === 'Premium' && liker.likesGivenToday >= 100
    ) {
      return res.status(403).json({ error: 'You have reached your daily like limit.' });
    }

    // Add like to the liked user's profile
    likedUser.likesReceived.push({ user: likerId });
    await likedUser.save();

    // Increment likesGivenToday for the liker
    liker.likesGivenToday += 1;
    await liker.save();

    res.status(201).json({ message: 'Profile liked successfully.' });
  } catch (error) {
    console.error('Error liking profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};



exports.likePhoto = async (req, res) => {
  try {
    const likerId = req.user.id; // Liking user
    const { photoId } = req.body;

    if (!photoId) {
      return res.status(400).json({ error: 'Photo to like is required.' });
    }

    const liker = await User.findById(likerId);
    const photo = await Photo.findById(photoId);

    if (!photo || !photo.isPublic) {
      return res.status(404).json({ error: 'Photo not found or is not public.' });
    }

    // Check if the liker has already liked this photo
    const alreadyLiked = photo.likes.some((like) => like.user.toString() === likerId);
    if (alreadyLiked) {
      return res.status(400).json({ error: 'You already liked this photo.' });
    }

    // Check daily like limits
    if (
      liker.accountType === 'Basic' && liker.likesGivenToday >= 5 ||
      liker.accountType === 'Premium' && liker.likesGivenToday >= 100
    ) {
      return res.status(403).json({ error: 'You have reached your daily like limit.' });
    }

    // Add like to the photo
    photo.likes.push({ user: likerId });
    await photo.save();

    // Increment likesGivenToday for the liker
    liker.likesGivenToday += 1;
    await liker.save();

    res.status(201).json({ message: 'Photo liked successfully.' });
  } catch (error) {
    console.error('Error liking photo:', error.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};
