const { calculateDistance } = require('../utils/proximity');
const { excludeMatches } = require('./matchUtils');

exports.matchUsers = async (currentUser, allUsers, userCoordinates) => {
  const { latitude, longitude } = userCoordinates;
  // Fetch matched or pending users
   // Fetch matched or pending users (ensure it is awaited)
   const matchedUserIds = await excludeMatches(currentUser._id);

  console.log("ExcludedMatches:", matchedUserIds)

  const datingGoalsGroups = {
    group1: ['Marriage: Traditional Roles', 'Marriage: 50/50', 'Long-term'],
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

  const isWithinAgeRange = (dob, minAge, maxAge) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age >= minAge && age <= maxAge;
  };

  
  const calculateCompatibility = (currentResponses, otherResponses) => {
    if (!currentResponses || !otherResponses) return 0;

    let score = 0;
    currentResponses.forEach((currentAnswer) => {
      const match = otherResponses.find(
        (response) => response.questionId.toString() === currentAnswer.questionId.toString()
      );
      if (match) {
        score += 5 - Math.abs(currentAnswer.answer - match.answer); // Higher score for closer answers
      }
    });

    return score;
  };

  //Match Filtering based on proximity, interests etc
  const filterMatches = (users, allowOutsideDistance = false) =>
    users
      .filter((user) => {
        console.log(`Checking User: ${user.firstName}`);
  
        // Exclude blocked users and self
        if (currentUser.blockedUsers.includes(user._id)) {
          console.log(`Excluded User: ${user.firstName} (Blocked by currentUser)`);
          return false;
        }
        if (user._id.equals(currentUser._id)) {
          console.log(`Excluded User: ${user.firstName} (Self exclusion)`);
          return false;
        }
        if (matchedUserIds.has(user._id.toString())) {
          console.log(`Excluded User: ${user.firstName} (Already matched or pending)`);
          return false;
        }
  
        // Exclude users with invalid location
        if (!user.location || !user.location.coordinates || user.location.coordinates.length !== 2) {
          console.log(`Excluded User: ${user.firstName} (Invalid location data)`);
          return false;
        }
  
        const [userLon, userLat] = user.location.coordinates;
        const distance = calculateDistance(latitude, longitude, userLat, userLon);
  
        // Exclude users outside preferred max distance
        if (!allowOutsideDistance && distance > currentUser.userPreferences.maxDistance) {
          console.log(`Excluded User: ${user.firstName} (Distance: ${distance} km exceeds max)`);
          return false;
        }
  
        // Exclude users outside preferred age range
        if (
          !isWithinAgeRange(
            user.dateOfBirth,
            currentUser.userPreferences.ageRange.min,
            currentUser.userPreferences.ageRange.max
          )
        ) {
          console.log(`Excluded User: ${user.firstName} (Age out of preferred range)`);
          return false;
        }
  
        // Exclude users not matching gender preference
        if (
          (currentUser.preference === 'Men' && user.gender !== 'Male') ||
          (currentUser.preference === 'Women' && user.gender !== 'Female')
        ) {
          console.log(`Excluded User: ${user.firstName} (Gender preference mismatch)`);
          return false;
        }
  
        return true; // Inclusion based on critical criteria
      })
      .map((user) => {
        const [userLon, userLat] = user.location.coordinates;
  
        const distance = calculateDistance(latitude, longitude, userLat, userLon);
  
        // Compute shared interests, zodiac signs, and compatibility score
        const sharedInterests = [
          ...new Set(currentUser.hobbies.filter((hobby) => user.hobbies.includes(hobby))),
        ].length;
  
        const sharedZodiac = currentUser.zodiacSigns.filter((sign) =>
          user.userZodiac.includes(sign)
        ).length;
  
        let compatibilityScore = calculateCompatibility(
          currentUser.compatibilityTest?.responses,
          user.compatibilityTest?.responses
        );
  
        // Default compatibility score if test data is absent
        if (
          !currentUser.compatibilityTest?.responses.length ||
          !user.compatibilityTest?.responses.length
        ) {
          compatibilityScore = 5; // Neutral score
        }
  
        return {
          user,
          rank:
            sharedInterests +
            sharedZodiac +
            compatibilityScore +
            (distance <= currentUser.userPreferences.maxDistance ? 2 : 0), // Proximity bonus
          distance,
        };
      });
  
  // Try matching users within the preferred max distance
  console.log(`Total users to filter: ${allUsers.length}`, allUsers);
  let matchedUsers = filterMatches(allUsers);

  // If no matches found, try relaxing the distance constraint
  if (matchedUsers.length === 0) {
    console.log('No matches found within max distance. Relaxing distance constraint.');
    matchedUsers = filterMatches(allUsers, true);
  }

  // Sort by rank (higher first), then by proximity (closer first)
  const sortedMatches = matchedUsers.sort(
    (a, b) => b.rank - a.rank || a.distance - b.distance
  );

  return sortedMatches;
};
