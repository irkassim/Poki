const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

//console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
//console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
//console.log('AWS_REGION:', process.env.AWS_REGION);

// Test S3 connection
s3.listBuckets((err, data) => {
    if (err) {
      console.error('S3 Connection Error:', err);
    } else {
      console.log('S3 Buckets:', data.Buckets);
    }
  });

  const getSignedUrls = async (keys) => {
    try {
      const signedUrls = await Promise.all(
        keys.map(async (key) => {
          try {
            return await s3.getSignedUrlPromise('getObject', {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: key,
              Expires: 360 * 360, // 1 hour
            });
          } catch (err) {
            console.error(`Error generating signed URL for key: ${key}`, err);
            throw err; // Continue to the next URL, or handle gracefully
          }
        })
      );

      //console.log("signedURLS:", signedUrls)
      return signedUrls;
    } catch (error) {
      console.error('Error in getSignedUrls:', error);
      throw new Error('Failed to generate signed URLs');
    }
  };
  
module.exports = getSignedUrls;
