const User = require('../models/user'); // Adjust path to your User model

// Save location to user profile
// router.post('/location', async (req, res) => {
//   const { userId, latitude, longitude } = req.body;

//   if (!userId || latitude == null || longitude == null) {
//     return res.status(400).json({ error: 'User ID, latitude, and longitude are required.' });
//   }

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     user.location = {
//       type: 'Point',
//       coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
//     };

//     await user.save();

//     res.status(200).json({ message: 'Location saved successfully.' });
//   } catch (err) {
//     console.error('Error saving location:', err.message);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });

exports.getGeoLoc = async (req, res) =>{
  const { userId, latitude, longitude } = req.body;

  if (!userId || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'User ID, latitude, and longitude are required.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
    };

    await user.save();

    res.status(200).json({ message: 'Location saved successfully.' });
  } catch (err) {
    console.error('Error saving location:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }

}