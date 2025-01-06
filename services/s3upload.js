
const Photo = require('../models/Photo');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3Upload  = async (files, userId) => {
    // Extract and validate publicPhoto files
    const myFiles = Array.isArray(files) ? files : [];

    if (!Array.isArray(myFiles)) {
      throw new Error('Expected files to be an array');
    }
  
    const photos = await Promise.all(
      myFiles.map(async (file) => {
        const photoKey = `public_photos/${Date.now()}-${file.originalname}`;
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: photoKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
  
        const uploadResult = await s3.upload(params).promise();
        console.log('S3 Upload Result:', uploadResult);
  
        // Create a Photo document
        const photo = new Photo({
          url: uploadResult.Location,
          key: uploadResult.Key,
          user: userId,
        });
        await photo.save();
  
        return { _id: photo._id, key: photo.key }; // Return both _id and key
      })
    );
  
    console.log("Generated Photos:", photos);
    return photos; // Return array of { _id, key }
};

module.exports = s3Upload ;