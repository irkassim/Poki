// services/matchService.js
const { calculateDistance } = require('../utils/proximity');

exports.matchUsers = (currentUser, allUsers, userCoordinates) => {
  const { latitude, longitude } = userCoordinates;

  const datingGoalsGroups = {
    group1: ['Marriage: Traditional Roles', 'Marriage: 50/50', 'Long-term',],
    group2: ['Open-minded', 'Short-term Fun', 'Not Sure'],
  };

  const isSameGroup = (goal1, goal2) => {
    return (
      (datingGoalsGroups.group1.includes(goal1) &&
        datingGoalsGroups.group1.includes(goal2)) ||
      (datingGoalsGroups.group2.includes(goal1) &&
        datingGoalsGroups.group2.includes(goal2))
    );
  };

  console.log("Current User:", currentUser);
  console.log("User Coordinates:", latitude, longitude);

  const matchedUsers = allUsers
    .filter((user) => {
      console.log(`Checking User: ${user.firstName}`);

      // Exclude blocked users and self
      if (currentUser.blockedUsers.includes(user._id) || user._id.equals(currentUser._id)) {
        console.log(`Excluded ${user.firstName}: Blocked or self.`);
        return false;
      }

      // Ensure valid location data for both users
      if (
        !user.location ||
        !user.location.coordinates ||
        user.location.coordinates.length !== 2 ||
        typeof user.location.coordinates[0] !== 'number' ||
        typeof user.location.coordinates[1] !== 'number'
      ) {
        console.log(`Excluded ${user.firstName}: Invalid location data.`);
        return false;
      }

      const [userLon, userLat] = user.location.coordinates;

      if (!latitude || !longitude) {
        console.log(`Excluded ${user.firstName}: Invalid current user coordinates.`);
        return false;
      }

      // Check proximity
      const distance = calculateDistance(latitude, longitude, userLat, userLon);
      console.log(`Distance to ${user.firstName}: ${distance} km`);

      if (distance > 150) {
        console.log(`Excluded ${user.firstName}: Outside proximity.`);
        return false;
      }

      // Check gender preference
      if (
        (currentUser.preference === 'Men' && user.gender !== 'Male') ||
        (currentUser.preference === 'Women' && user.gender !== 'Female')
      ) {
        console.log(`Excluded ${user.firstName}: Gender preference mismatch.`);
        return false;
      }

      // Check dating goal compatibility
      const sameGroup = isSameGroup(currentUser.datingGoals, user.datingGoals);
      console.log(`Dating Goal Compatibility with ${user.firstName}:`, sameGroup);

      return sameGroup;
    })
    .map((user) => {
      const [userLon, userLat] = user.location.coordinates;

      const distance = calculateDistance(latitude, longitude, userLat, userLon);

      const sharedInterests = [
        ...new Set(
          currentUser.hobbies.filter((hobby) => user.hobbies.includes(hobby))
        ),
      ].length;

      const sharedZodiac = [
        ...new Set(
          currentUser.zodiacSigns.filter((sign) => user.zodiacSigns.includes(sign))
        ),
      ].length;

      const sharedFavorites = currentUser.favorite?.value === user.favorite?.value ? 1 : 0;

      return {
        user,
        rank: sharedInterests + sharedZodiac + sharedFavorites,
        distance,
      };
    });

  // Sort by rank (higher first), then by proximity (closer first)
  const sortedMatches = matchedUsers.sort(
    (a, b) => b.rank - a.rank || a.distance - b.distance
  );

  console.log("Matched Users:", sortedMatches);
  return sortedMatches;
};

