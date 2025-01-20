const Match = require('../models/match');

/**
 * Exclude already matched or pending users from the potential matches.
 *
 * @param {ObjectId} currentUserId - The ID of the current user.
 * @returns {Promise<Set>} - A set of user IDs to be excluded.
 */
const excludeMatches = async (currentUserId) => {
  // Fetch all existing matches for the current user
  const existingMatches = await Match.find({
    users: currentUserId,
    status: { $in: ['pending', 'accepted'] },
  });

  // Extract IDs of already matched or pending users
  const matchedUserIds = existingMatches.reduce((acc, match) => {
    match.users.forEach((userId) => {
      if (!userId.equals(currentUserId)) {
        acc.add(userId.toString());
      }
    });
    return acc;
  }, new Set());

  return matchedUserIds;
};

module.exports = {
  excludeMatches,
};
