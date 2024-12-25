const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const Poke = require('../models/pokeModel');
const Match = require('../models/match');
const User = require('../models/user');


exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const sender = req.user.id;

    if (!recipient || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }

   /*  // Check if the recipient has blocked the sender
    if (await isBlocked(sender, recipient)) {
      return res.status(403).json({ error: 'You are blocked by this user and cannot message them.' });
    } */

    const user = await User.findById(req.user.id);

    if (user.blockedUsers.includes(req.user.id)) {
      return res.status(400).json({ error: 'You are blocked by this user ' });
    }

    // Check if the sender and recipient are eligible to message
    const poke = await Poke.findOne({
      $or: [
        { poker: sender, pokee: recipient, status: 'accepted' },
        { poker: recipient, pokee: sender, status: 'accepted' },
      ],
    });

    const match = await Match.findOne({
      participants: { $all: [sender, recipient] },
    });



    if (!poke && !match) {
      return res.status(403).json({ error: 'You are not eligible to message this user' });

    }

     // Check if a conversation already exists
     let conversation = await Conversation.findOne({
      participants: { $all: [sender, recipient] },
    });

     // Create a new conversation if none exists
     if (!conversation) {
      conversation = new Conversation({
        participants: [sender, recipient],
      });
      await conversation.save();
    }

    // Proceed with creating and sending the message
    const message = new Message({
      conversationId: conversation._id,
      sender,
      recipient,
      content,
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort('createdAt');

    if (!messages.length) {
      return res.status(404).json({ error: 'No messages found in this conversation' });
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username limitedProfile')
      .populate('lastMessage');

    if (!conversations.length) {
      return res.status(404).json({ error: 'No conversations found' });
    }

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
