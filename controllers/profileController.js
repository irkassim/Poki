//const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const express = require('express');
const AWS = require('aws-sdk');
const User = require('../models/user');
const Match = require('../models/match');
const Poke = require('../models/pokeModel');
const Photo = require('../models/Photo'); // Update the path as per your project structure
const s3Upload  =  require('../services/s3upload');
const  getSignedUrls  = require('../services/getSignedUrls');
const getSingleSignedUrl=require('../services/getSingleSignedUrl')
const querystring = require('querystring');
const { match } = require('assert');
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
    //console.log("Uploaded Photos:", newPhotos);

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

    //console.log("Public Photos with Signed URLs:", publicPhotosWithSignedUrls);

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
   // console.log("User:",req.user.id )

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
        // Attach the avatar URL to the user data
        // console.log("Avatarurl:", avatarUrl)
        const userProfile = { ...user };
       // console.log("Profile:",userProfile)
  
    // Send the final response
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Get USER PROFILE WITH FEATURES - pokes,matches
exports.getUserProfile = async (req, res) => {
  console.log("Get USERProfile Hit")
  //const parsedQuery = querystring.parse(req.url.split('?')[1]);
  const {type} = req.query;
  const { id: userId } = req.params; // Extract match/poke ID from URL params
  let matchDetails = null ;
  let pokeDetails=null;
  const {use: matchOrPokeId} = req.query; // Extract `userId` from query parameters

  try {
         /*  console.log("URL",  req.url);
          console.log("type",   type);
          console.log("USERID",  userId);
          console.log("MatchOrPoke",matchOrPokeId) */
     
    //Validation for details
    if (!matchOrPokeId || !userId) {
      return res.status(400).json({ error: 'Match/Poke ID or User ID is missing' });
    }
          // Fetch user data by ID
        const user = await User.findById(userId)
          .populate({ path: 'publicPhotos',select: 'key',  }) .lean();

          //console.log("USER",  user.avatar);

         if(matchOrPokeId && type ==="match"){
             // Match Details
             matchDetails = await Match.findOne({
              _id: matchOrPokeId, // Use matchOrPokeId from URL params
              users: userId,      // Ensure this user is part of the match
              status: { $in: ['pending', 'accepted'] },
            }).lean();

         }
        // Poke Details
        if(matchOrPokeId && type ==="poke"){
            pokeDetails = await Poke.findOne({
            _id: matchOrPokeId, // Use matchOrPokeId from URL params
            users: userId,      // Ensure this user is part of the poke
            status: { $in: ['pending', 'accepted'] }, }).lean();
         }

        // pokeDetails && console.log("PokeDet",pokeDetails)

            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }

            let avatarKey = null;
            if (user.avatar) {
              const avatarDoc = await Photo.findById(user.avatar).lean();
              if (avatarDoc && avatarDoc.key) {
                avatarKey = avatarDoc.key;
              } else {
                console.error('Avatar document or key not found');
              }
            }
        
    // Generate signed URLs for avatar and public photos
   // Generate signed URL for the avatar
   const signedAvatarUrl = avatarKey ? await getSingleSignedUrl(avatarKey) : null;

    //console.log("User Avatar:",signedAvatarUrl);
    const signedPublicPhotos = user.publicPhotos.length ?
     await getSignedUrls(user.publicPhotos.map((photo) => photo.key)) : [];
    // console.log("SignedPublic:", signedPublicPhotos)

    // Respond with user data and signed URLs
    res.status(200).json({
      user: {
        ...user,
        avatar: signedAvatarUrl,
        publicPhotos: signedPublicPhotos,
      },
      matchDetails: matchDetails ? {
            status: matchDetails.status,
            duration: matchDetails.createdAt,
            commonInterests: 'Movies, Scorpio', // Example interests
          } : null,
      pokeDetails: pokeDetails ? {
            status: pokeDetails.status,
            duration: pokeDetails.createdAt,
            commonInterests: 'Movies, Scorpio', // Example interests
          }: null,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
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
    //console.log("sentfromFrontEndAvatar:",avatar)

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
    const signedUrl = await getSignedUrls([selectedPhoto.key]);

    /* console.log("JUSTONESignedURL:", signedUrl[0])
    console.log("SignedURL:", signedUrl) */

    res.status(200).json({
      message: 'Avatar updated successfully',
      avatar: {
        _id: selectedPhoto._id,
        src:  signedUrl[0], // Assuming the URL or signed URL is available
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