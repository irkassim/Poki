
const User = require('../models/user');

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    try {
      // Verify the refresh token
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }
  
      // Generate a new access token
      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        console.log("Access Token:", newAccessToken) //testing 

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  };
  