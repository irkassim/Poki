const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const Poke = require('../models/pokeModel');
const Match = require('../models/match');
const User = require('../models/user');
const {fetchSignedAvatarUrl} = require("../utils/fetchSignedAvatarUrl")
const utils = require('../utils/fetchSignedAvatarUrl');
//console.log(utils); // Verify what is being exported


//Get Pokes
exports.getPokes = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch pokes where the user is the pokee
      const pokes = await Poke.find({ pokee: userId })
        .populate({
            path: 'poker',
            select: 'firstName avatar',
            populate: {
            path: 'avatar',
            select: 'key', // Fetch only the `key` field from the `avatar` document
            },
        })
        .lean();

      // Map over pokes and fetch signed URL for each poker's avatar
      const pokesWithAvatars = await Promise.all(
        pokes.map(async (poke) => {
          if (!poke.poker.avatar || !poke.poker.avatar.key) {
            console.warn('Avatar key is missing for poker:', poke.poker._id);
            return {
              ...poke,
              poker: {
                ...poke.poker,
                avatar: null, // No avatar to display
              },
            };
          }
      
          const signedUrl = await fetchSignedAvatarUrl({ avatar: { key: poke.poker.avatar.key } });
          return {
            ...poke,
            poker: {
              ...poke.poker,
              avatar: signedUrl || null, // Use the signed URL or fallback to null
            },
          };
        })
      );
      
  
      res.status(200).json({ data: pokesWithAvatars });
    } catch (error) {
      console.error('Error fetching pokes:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  //Getting Matches
  exports.getMatches = async (req, res) => {
    try {
      const userId = req.user.id;

      // Fetch matches involving the user
      const matches = await Match.find({ users: userId })
        .populate({ path: 'users', select: 'firstName avatar',
          populate: {  path: 'avatar',
            select: 'key', // Fetch only the `key` field from the `avatar` document
          },}) .lean();

         // console.log("matches:", matches )
  
      // Map over matches and fetch signed URLs for avatars
      const matchesWithAvatars = await Promise.all(
        matches.map(async (match) => {
          const usersWithAvatars = await Promise.all(
            match.users.map(async (user) => {
              if (!user.avatar || !user.avatar.key) {
                console.warn('Avatar key is missing for user:', user._id);
                return {
                  ...user,
                  avatar: null, // No avatar to display
                };
              }
  
              const signedUrl = await fetchSignedAvatarUrl({ avatar: { key: user.avatar.key } });
              return { ...user,  avatar: signedUrl || null,  }; })
          );
  
          return {  ...match, users: usersWithAvatars, }; })
      );
  
      res.status(200).json({ data: matchesWithAvatars });
    } catch (error) {
      console.error('Error fetching matches:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  //Get Messages
  exports.getMessages = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch user conversations
      const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'firstName avatar')
        .populate({
          path: 'lastMessage',
          select: 'content createdAt sender',
        })
        .lean();
        //console.log("convos:", conversations)
      // Map over conversations and fetch signed URLs for participants' avatars
      const conversationsWithAvatars = await Promise.all(
        conversations.map(async (conversation) => {
          const updatedParticipants = await Promise.all(
            conversation.participants.map(async (user) => ({
              ...user,
              avatar: await fetchSignedAvatarUrl(user) || user.avatar?.url || null,
            }))
          );
  
          return {
            ...conversation,
            participants: updatedParticipants,
          };
        })
      );
  
      res.status(200).json({ data: conversationsWithAvatars });
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  