const User = require('../models/user');

exports.extendRefreshToken = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate a new refresh token
      const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
      console.log("Access Token:", newRefreshToken) //testing 

      user.refreshToken = newRefreshToken;
      await user.save();
  
      res.setHeader('x-refresh-token', newRefreshToken); // Optionally send the new token in headers
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to extend token' });
    }
  };
  