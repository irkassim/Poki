

const checkAccountRestrictions = (feature) => (req, res, next) => {
    const user = req.user; // Assume user is attached to the request
    const now = new Date();
  
    if (user.accountType === 'Basic') {
      if (feature === 'poke' && user.pokesSentToday >= 60) {
        return res.status(403).json({ error: 'Daily poke limit reached.' });
      }
      if (feature === 'explore' && user.exploreUsedToday) {
        return res.status(403).json({ error: 'Explore feature can only be used once a day.' });
      }
    }
  
    if (user.accountType === 'Daily' && now > user.subscriptionExpiresAt) {
      user.accountType = 'Basic'; // Downgrade expired Daily users
      return res.status(403).json({ error: 'Your Daily account privileges have expired.' });
    }
  
    next();
  };
  