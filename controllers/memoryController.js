const Memory = require('../models/memory');
const multer = require('multer');
const User = require('../models/user')
const path = require('path');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

//upload memory 
exports.uploadMemory = async (req, res) => {

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized. User information is missing.' });
  }
  try {
    
    const file = req.files.memoryFile[0];
    const { description } = req.body;
   
        // Log details for debugging
        /* console.log('File:', file);
        console.log('Buffer:', file.buffer); */
  
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Define S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `memories/${Date.now()}-${file.originalname}`,
      Body: file.buffer, // File buffer from Multer
      ContentType: file.mimetype,
    };

    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    console.log('S3 Upload Result:', uploadResult);

    console.log(uploadResult.Location)
    // Ensure memoryUrl and userId are present
    if (!uploadResult.Location) {
      return res.status(500).json({ error: 'File upload failed. Memory URL is missing.' });
    }

    // Save file details and description to the database
    const memory = new Memory({
      userId: req.user.id,
      memoryUrl: uploadResult.Location, // S3 file URL
      type: file.mimetype.startsWith('image') ? 'photo' : 'video',
      description,
    });
    

    await memory.save();

    res.status(200).json({
      message: 'Received file and description successfully',
      file: req.files.memoryFile[0], // Access the uploaded file
      description,
    });;
  } catch (error) {
    console.error('Error uploading memory:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get shared memories for a user
exports.getSharedMemories = async (req, res) => {
  try {
    const userId = req.params.userId; // Target user ID

    // Fetch shared memories for the specified user
    const memories = await Memory.find({ userId, visibility: 'shared' });

    res.status(200).json({ sharedMemories: memories });
  } catch (error) {
    console.error('Error fetching shared memories:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Multer middleware export
//exports.uploadMiddleware = upload.single('memoryFile');


exports.shareMemory = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { visibility = 'shared', sharedWith } = req.body;

    // Validate visibility
    if (!['hidden', 'shared'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility value' });
    }

    // Find the memory by ID
    const memory = await Memory.findOne({ _id: memoryId, userId: req.user.id });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found or unauthorized' });
    }

    // Update the memory's visibility and optional sharedWith users
    memory.visibility = visibility;
    if (sharedWith) {
      memory.sharedWith = sharedWith; // Ensure this field exists in the schema
    }

    await memory.save();

    res.status(200).json({ message: 'Memory shared successfully', memory });
  } catch (error) {
    console.error('Error sharing memory:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




