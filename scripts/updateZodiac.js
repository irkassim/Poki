const mongoose = require('mongoose');
const User = require('./models/user'); // Path to your user model
const getZodiacSign = require('./zodiacs'); // Path to your zodiac utility
const dotenv=require("dotenv")
dotenv.config()//
const dbURI = `mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`; // Replace with your database URI

(async () => {
  try {
    // Connect to the database
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database.');

    // Fetch users
    const users = await User.find();

    for (const user of users) {
      if (user.dateOfBirth) {
        user.userZodiac = getZodiacSign(user.dateOfBirth);
        await user.save();
        console.log(`Updated user ${user.firstName} with zodiac ${user.userZodiac}`);
      }
    }

    console.log('All users updated successfully.');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from database.');
    process.exit();
  }
})();
