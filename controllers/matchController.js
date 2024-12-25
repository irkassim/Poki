const Match = require('../models/match');
const User = require('../models/user');

exports.initiateMatch = async (req, res) => {
  try {
    const userId = req.user.id; // The logged-in user
    const targetUserId = req.params.userId; // The user to initiate a match with

    // Check if a match request already exists
    const existingMatch = await Match.findOne({
      users: { $all: [userId, targetUserId] },
      status: 'pending',
    });
    if (existingMatch) {
      return res.status(400).json({ message: 'Match request already initiated' });
    }

    // Create a match request
    const newMatch = new Match({
      users: [userId, targetUserId],
      status: 'pending',
    });
    await newMatch.save();

    return res.status(200).json({ message: 'Match request initiated!', match: newMatch });
  } catch (error) {
    console.error('Error initiating match:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.acceptMatch = async (req, res) => {
  try {
    const matchId = req.params.matchId; // Match request ID

    // Update the match status to 'accepted'
    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { status: 'accepted' },
      { new: true }
    );
    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match request not found' });
    }

    return res.status(200).json({ message: 'Match accepted!', match: updatedMatch });
  } catch (error) {
    console.error('Error accepting match:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.rejectMatch = async (req, res) => {
  try {
    const matchId = req.params.matchId; // Match request ID

    // Delete the match request
    const deletedMatch = await Match.findByIdAndDelete(matchId);
    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match request not found' });
    }

    return res.status(200).json({ message: 'Match rejected successfully!' });
  } catch (error) {
    console.error('Error rejecting match:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
