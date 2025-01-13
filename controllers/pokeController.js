const Poke = require('../models/pokeModel');
const User = require('../models/user');



exports.createPoke = async (req, res) => {
  try {
    const { pokee } = req.body;
    const poker = req.user.id;

    if (!pokee) {
      return res.status(400).json({ error: 'Pokee is required' });
    }
     // Check if the pokee has blocked the poker
     const pokeeUser = await User.findById(pokee);

     if (pokeeUser.blockedUsers.includes(poker)) {
       return res.status(403).json({
         error: 'You are blocked by this user and cannot poke them.',
       });
     }

    // Check for recent pokes to the same user
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

    const recentPokes = await Poke.find({
      poker,
      pokee,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentPokes.length > 0) {
      return res.status(429).json({
        error: 'You have already poked this user recently. Please wait before poking again.',
      });
    }

    // Check daily poke limit (e.g., 10 pokes per day)
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const dailyPokes = await Poke.find({
      poker,
      createdAt: { $gte: startOfDay },
    });

    if (dailyPokes.length >= 10) {
      return res.status(429).json({
        error: 'You have reached your daily poke limit.',
      });
    }

    // Create the poke
    const poke = new Poke({ poker, pokee });
    await poke.save();

    res.status(201).json({ message: 'Poke created successfully', poke });
  } catch (error) {
    console.error('Error creating poke:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.acceptPoke = async (req, res) => {

  //console.log("AcceptPoke Route", req.params.pokeId)
  try {
    const { pokeId } = req.params;

    const poke = await Poke.findById(pokeId);
    //console.log(pokeId, req.user.id, poke.pokee.toString())

    if (!poke) {
      return res.status(404).json({ error: 'Poke not found' });
    }

    if (poke.pokee.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    poke.status = 'accepted';
    await poke.save();

    res.status(200).json({ message: 'Poke accepted', poke });
  } catch (error) {
    console.error('Error accepting poke:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removePoke = async (req, res) => {
  
  //console.log("RejectPoke Route", req.params.pokeId)
  try {
    const userId = req.user.id; // The logged-in user
    const targetUserId = req.params.userId; // The user whose poke is being removed

    // Remove the poke
    const deletedPoke = await Poke.findOneAndDelete({ from: userId, to: targetUserId });
    if (!deletedPoke) {
      return res.status(404).json({ message: 'No poke found to remove' });
    }

    return res.status(200).json({ message: 'Poke removed successfully!' });
  } catch (error) {
    console.error('Error removing poke:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

