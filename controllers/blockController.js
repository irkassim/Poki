const Poke = require('../models/pokeModel');
const User = require('../models/user');


//block users
exports.blockUser = async (req, res) => {
    try {
      const { blockUserId } = req.body; // ID of the user to block
      const userId = req.user.id; // ID of the current user (from the JWT)
  
      if (!blockUserId) {
        return res.status(400).json({ error: 'User to block is required' });
      }
  
      // Ensure the user exists
      const userToBlock = await User.findById(blockUserId);
      if (!userToBlock) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the current user's blockedUsers array
      const user = await User.findById(userId);
      if (user.blockedUsers.includes(blockUserId)) {
        return res.status(400).json({ error: 'User is already blocked' });
      }
  
      user.blockedUsers.push(blockUserId);
      await user.save();
  
      res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
      console.error('Error blocking user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

//unblock User
  exports.unblockUser = async (req, res) => {
    try {
      const { unblockUserId } = req.body; // ID of the user to unblock
      const userId = req.user.id; // ID of the current user (from the JWT)
  
      if (!unblockUserId) {
        return res.status(400).json({ error: 'User to unblock is required' });
      }
  
      // Update the current user's blockedUsers array
      const user = await User.findById(userId);
      const index = user.blockedUsers.indexOf(unblockUserId);
  
      if (index === -1) {
        return res.status(400).json({ error: 'User is not in blocked list' });
      }
  
      user.blockedUsers.splice(index, 1); // Remove the user from the blockedUsers array
      await user.save();
  
      res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
      console.error('Error unblocking user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  