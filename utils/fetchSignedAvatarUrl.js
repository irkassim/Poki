const  getSignedUrls = require('../services/getSignedUrls'); //
const User = require('../models/user');

exports.fetchSignedAvatarUrl = async (user) => {
    if (!user.avatar || !user.avatar.key) {
        console.warn('No avatar key provided');
        return null; // No key to generate signed URL
      }
  try {

    console.log("avataKey:", user.avatar.key)
    const signedUrls = await getSignedUrls([user.avatar.key]); // Assuming `user.avatar` is populated with key
    return signedUrls || null; // Return the first URL if available
  } catch (error) {
    console.error('Error fetching avatar signed URL:', error.message);
    return null; // Proceed without signed URL if there's an error
  }
};
