const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verify JWT and Extend token

exports.verifyToken = (req, res, next) => {
 console.log('Authorization Header:', req.headers['authorization']);

 const authHeader = req.headers['authorization'];
  const refreshToken = req.body.refreshToken;
  console.log('Refresh Token: Vrifyroute',req.body.refreshToken, req.body);

  // Extract access token
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: 'Access and refresh tokens are required' });
  }

  try {
    // Verify the access token
    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ error: 'Access token has expired' });
        }
        return res.status(403).json({ error: 'Invalid access token' });
      }

      // Verify the refresh token
      const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const dbUser = await User.findById(decodedRefresh.id);
      //console.log(dbUser.token)

      if (!dbUser || dbUser.refreshToken !== refreshToken) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      // Proceed without generating a new refresh token
      req.user = user; // Attach user to request for downstream logic
      next();
    });
  } catch (error) {
    console.error('Error verifying tokens:', error.message);
    return res.status(500).json({ error: 'Failed to verify tokens' });
  }
};
