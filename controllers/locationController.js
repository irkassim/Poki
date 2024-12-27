const User = require('../models/user');


//Update Location
exports.updateLocation = async (req, res) => {
  
 const {  latitude, longitude } = req.body;
      //console.log("requestbody:",req.body, "userId",req.user.id)
      //console.log('Authorization Header:', req.headers['authorization']);

    if ( latitude == null || longitude == null) {
        return res.status(400).json({ error: ' latitude, and longitude are required.' });
      }
    try {
      const user = await User.findById(req.user.id);
            if (!user) {
              return res.status(404).json({ error: 'User not found.' });
            }

            user.location = {
              type: 'Point',
              coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
            };

     const updatedUser =  await user.save();
     //console.log("updatedUser:", updatedUser )
      res.status(200).json({ message: 'Location saved successfully.' });
    } catch (err) {
      console.error('Error saving location:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }


};


//Get Suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);

    if (!user || !user.location) {
      return res.status(400).json({ error: 'User location not set' });
    }

    const maxDistance = 5000; // 5 km in meters

    // Determine gender filter based on user preference
    let genderFilter = {};
    if (user.preference === 'Men') {
      genderFilter = { gender: 'Male' };
    } else if (user.preference === 'Women') {
      genderFilter = { gender: 'Female' };
    }
    // No filter needed if preference is 'Everyone'

    // Query nearby users with gender preference
    const nearbyUsers = await User.find({
      _id: { $ne: req.user.id }, // Exclude the current user
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: maxDistance,
        },
      },
      ...genderFilter, // Apply gender filter
    }).select('username limitedProfile location gender');

    // Construct suggestions with distance calculations
    const suggestions = nearbyUsers.map((u) => ({
      id: u._id,
      username: u.username,
      limitedProfile: u.limitedProfile,
      distance: calculateDistance(user.location.coordinates, u.location.coordinates),
    }));

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to calculate distance (optional)
const calculateDistance = (coords1, coords2) => {
  const [lng1, lat1] = coords1;
  const [lng2, lat2] = coords2;
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};
