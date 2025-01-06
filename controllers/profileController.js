//const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const User = require('../models/user');
const Photo = require('../models/Photo'); // Update the path as per your project structure
const s3Upload  =  require('../services/s3upload');
const  getSignedUrls  = require('../services/getSignedUrls');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

//Update profile
// Update Text Fields
exports.updateTextFields = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    console.log('Text Updates:', updates);

    // Dynamically get all valid fields from the User schema
    const validFields = ['bio', 'zodiacSigns', 'favorite', 'education', 'datingGoals', "gender","preference", "isProfileComplete", 'hobbies', 'occupation', 'username'];
    
    // Filter updates to include only valid fields
    const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
      if (validFields.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    // Reject Empty Updates
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Text fields updated successfully!', user });
  } catch (error) {
    console.error('Text Fields Update Error:', error);
    res.status(500).json({ error: 'Failed to update text fields' });
  }
};

//Updating images
exports.updateImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;
    console.log("FILES", files);

    if (!files || !files.publicPhoto || files.publicPhoto.length === 0) {
      return res.status(400).json({ error: 'No public photos uploaded' });
    }

    // Fetch the user and populate publicPhotos
    const user = await User.findById(userId).populate('publicPhotos');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Upload new photos to S3
    const newPhotos = await s3Upload(files.publicPhoto, userId); // [{ _id, key }]
    console.log("Uploaded Photos:", newPhotos);

    const newPhotoIds = newPhotos.map(photo => photo._id);
    //const newPhotoKeys = newPhotos.map(photo => photo.key);

    // Update user's publicPhotos
    user.publicPhotos.push(...newPhotoIds);
    await user.save();

    // Ensure all photos are populated
    await user.populate('publicPhotos');

    // Generate signed URLs
    const allPhotoKeys = user.publicPhotos.map(photo => photo.key);

    if (!allPhotoKeys.every(key => !!key)) {
      console.error('Missing keys in some photos:', user.publicPhotos);
      return res.status(500).json({ error: 'Missing keys in some photos' });
    }
    const signedUrls = await getSignedUrls(allPhotoKeys);

      // Prepare response with new photos
    const publicPhotosWithSignedUrls = user.publicPhotos.map((photo, index) => ({
      _id: photo._id,
      src: signedUrls[index],
    }));

    console.log("Public Photos with Signed URLs:", publicPhotosWithSignedUrls);

    // Respond with updated photos
    res.status(200).json({
      message: 'Images updated successfully',
      publicPhotos: publicPhotosWithSignedUrls,
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ error: 'Failed to update images' });
  }
};


//Get whole Profile however the route is a post
exports.getProfile = async (req, res) => {
  console.log("Get Profile Hit:",req.user.id)
 
  try {
    const userId = req.user.id; // Extracted from the middleware
    console.log("User:",req.user.id )

    if (!req.user.id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    /* const user = await User.findById(userId).select(
      ' email firstName lastName bio avatar favoriteMovies favoriteSongs location boostsUsedToday pokesUsedToday matchesUsedToday, exploreUsedToday'
    ); */

    const user = await User.findById(userId).lean(); // Fetch user profile data

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Default the avatarUrl to null
    let avatarUrl = null;
    
    if(user.avatar){
      /* const avatarStream = s3
      .getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: user.avatar, // `user.avatar` holds the S3 object key
      })
      .createReadStream(); */

    // Option 1: Return the avatar as a separate field with a signed URL
    try {
      avatarUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: user.avatar,
        Expires: 360 * 360, // URL valid for 1 hour
      });
    } catch (err) {
      console.error('Error fetching avatar from S3:', err);
      // Log the error but don't terminate the request
    }

    // Option 2: Serve the binary data (for example, in-memory buffer)
    // const buffer = await streamToBuffer(avatarStream); // Helper function
    // user.avatarBinary = buffer.toString('base64'); // Include binary as base64
     }

     // Attach the avatar URL to the user data
    // console.log("Avatarurl:", avatarUrl)
    const userProfile = { ...user, avatarUrl };
  
    // Send the final response
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Userphotos
exports.getUserWithPhotoUrls = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user with populated publicPhotos
    const user = await User.findById(userId).populate('publicPhotos');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract keys from user's public photos
    const photoKeys = user.publicPhotos.map((photo) => photo.key);

    // Generate signed URLs for these keys
    const signedUrls = await getSignedUrls(photoKeys);

    //console.log("SignedURLS:",signedUrls)
    user.publicPhotos.push()

    // Replace photo keys with signed URLs
    const publicPhotosWithSignedUrls = user.publicPhotos.map((photo, index) => ({
      ...photo.toObject(),
      id:photo._id,
      src: signedUrls[index],
      key: photo.key,
      user: photo.user,
    }));

    res.status(200).json({
      user: {
        ...user.toObject(),
        publicPhotos: publicPhotosWithSignedUrls, // Include signed URLs
      },
    });
  } catch (error) {
    console.error('Error in getUserWithPhotoUrls:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

//Choose Profile Pic
exports.setUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's details
    const { avatar } = req.body; // Avatar ID sent from the frontend
    console.log("sentfromFrontEndAvatar:",avatar)

    if (!avatar) {
      return res.status(400).json({ error: 'Avatar ID is required' });
    }

    // Fetch the user and ensure the avatar is in their publicPhotos
    const user = await User.findById(userId).populate('publicPhotos');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const selectedPhoto = user.publicPhotos.find((photo) => photo._id.toString() === avatar);
    if (!selectedPhoto) {
      return res.status(400).json({ error: 'Selected photo not found in public photos' });
    }

    // Update the avatar field
    user.avatar = selectedPhoto._id; // Save the photo ID as the avatar reference
    await user.save();

    res.status(200).json({
      message: 'Avatar updated successfully',
      avatar: {
        _id: selectedPhoto._id,
        src: selectedPhoto.signedUrl || selectedPhoto.url, // Assuming the URL or signed URL is available
      },
    });
  } catch (error) {
    console.error('Error setting avatar:', error);
    res.status(500).json({ error: 'Failed to set avatar' });
  }
};

//Deleting Images 
// DELETE /api/profile/delete-image
exports.deleteImage = async (req, res) => {
  const { imageId } = req.body; // Expecting the ObjectId of the Photo to be deleted

  if (!imageId) {
    return res.status(400).json({ error: "Image ID is required" });
  }

  try {
    const userId = req.user.id;

    console.log("Deleting image for User:", userId, "Image ID:", imageId);

    // Step 1: Remove the Photo document from the database
    const deletedPhoto = await Photo.findByIdAndDelete(imageId);

    if (!deletedPhoto) {
      return res.status(404).json({ error: "Photo not found" });
    }

    console.log("Deleted Photo:", deletedPhoto);

    // Step 2: Remove the reference from the User's publicPhotos array
    const updateResult = await User.updateOne(
      { _id: userId },
      { $pull: { publicPhotos: imageId } } // Remove the reference by ObjectId
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ error: "Photo reference not found in user document" });
    }

    console.log("Updated User Document:", updateResult);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};