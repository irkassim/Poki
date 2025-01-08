const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Fetch a signed URL for a single S3 object key.
 * @param {string} key - The S3 object key for which to generate a signed URL.
 * @returns {Promise<string | null>} - The signed URL or null if an error occurs.
 */
const getSingleSignedUrl = async (key) => {
  if (!key) {
    console.error('Key is required to generate a signed URL');
    return null;
  }
  
  console.log("SingleKey:", key)
  try {
    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600, // 1 hour in seconds
    });

     console.log("SingleSigned:", signedUrl)
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for key: ${key}`, error);
    return null;
  }
};

module.exports = getSingleSignedUrl;
