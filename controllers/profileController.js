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
  try {
    const userId = req.user.id; // Extract user ID from the token
    const updates = req.body; // Fields to update

    console.log('Updates:', updates);
    console.log('Body:', req.body);

    // Dynamically get all valid fields from the User schema
    const validFields = Object.keys(User.schema.paths);
   
    // Filter updates to include only fields present in the schema
    const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
      if (validFields.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    //Reject Empty Updates: If no valid fields are present in the update payload:
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update now' });
    }
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle avatar upload
    if (req.files?.avatar) {
      const avatarFile = req.files.avatar[0]; // Access the first file in the array
      const avatarKey = `profile/${Date.now()}-${avatarFile.originalname}`;
      console.log("AvatarFile:", avatarFile);

      // Define S3 upload parameters
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: avatarKey,
        Body: avatarFile.buffer, // File buffer from Multer
        ContentType: avatarFile.mimetype, // File type
      };

      // Upload to S3
      const uploadResult = await s3.upload(params).promise();
      console.log('S3 Upload Result:', uploadResult);
      // Generate a URL for the uploaded file
      //const avatarUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${avatarKey}`;


      // Save URL to the user's profile
            user.avatar = avatarKey;
            await user.save();
    }

   /*  // If memory
        if (key === 'memories' && Array.isArray(updates[key])) {
      user.memories.push(...updates[key]);
    }
 */

      // Update user with filtered fields
    Object.assign(user, filteredUpdates);
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
  console.log(req.user.id)
 
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
     console.log("Avatarurl:", avatarUrl)
    const userProfile = { ...user, avatarUrl };

    
    
    // Send the final response
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

