const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const Poke = require('../models/pokeModel');
const Match = require('../models/match');
const User = require('../models/user');
//const {fetchSignedAvatarUrl} = require("../utils/fetchSignedAvatarUrl")
const Photo = require('../models/Photo'); // Update the path as per your project structure
//const  getSignedUrls  = require('../services/getSignedUrls');
const getSingleSignedUrl=require('../services/getSingleSignedUrl')
//const { Server } = require('socket.io');


exports.sendMessage = async (req, res) => {
 // console.log("SendMessage Hit:", req.body)
  try {
    const { recipient, content } = req.body;
    const sender = req.user.id;

    console.log("The Sender",sender)

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
    /* const poke = await Poke.findOne({
      $or: [
        { poker: sender, pokee: recipient, status: 'accepted' },
        { poker: recipient, pokee: sender, status: 'accepted' },
      ],
    }); */

    const poke = await Poke.findOne({
      $and: [
        { status: 'accepted' },
        { poker: { $in: [sender, recipient] } },
        { pokee: { $in: [sender, recipient] } },
      ],
    });
    
    if (!poke) {
      console.error("Poke not found or not accepted:", { sender, recipient });
      return res.status(400).json({ error: "No accepted poke between users." });
    }
    
   // console.log("Poke found:", poke);

    const match = await Match.findOne({
      users: { $all: [sender, recipient] },
    });

    console.log("here is the match:", match)

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
      sender,recipient, content});

    // Update the conversation's lastMessage field
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: message._id, updatedAt: Date.now() });
    await message.save();

    /* const io = socket(Server)
    io.on('connection', (socket) => {
      console.log('New Socket.IO connection:', socket.id);
     
     // emit event to send message data to connected clients
     io.to(conversation._id,
      sender,recipient).emit('chat', message);
    }) */
    

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {

    const {use: conversationId } = req.query;
   // const {type} = req.query;
    /* console.log("ConvosID:,", conversationId)
    console.log("Type,", type) */

    const rawMessages = await Message.find({ conversationId }).populate({
      path: 'sender', select: 'firstName avatar limitedProfile', })
    .populate({path: 'recipient',select: 'firstName avatar',}).sort('createdAt');

          const messages = await Promise.all(
            rawMessages.map(async (msg) => {
              /* console.log("AVATAR:",msg.sender.avatar)
              console.log("AVATAR:",msg.recipient.avatar) */
              // Fetch sender avatar URL
              let senderAvatarSignedUrl = null;
              if (msg.sender?.avatar) {
                const senderPhoto = await Photo.findById(msg.sender.avatar).lean();

                if (senderPhoto && senderPhoto.key) {
                  //console.log("SenderPhoto:",senderPhoto)
                  senderAvatarSignedUrl = await getSingleSignedUrl(senderPhoto.key);
                  //console.log("SenderPhotoKey:",senderPhoto.key)
                 // console.log("SendertAvatar:", senderAvatarSignedUrl)
                }
              }
      
              // Fetch recipient avatar URL
              let recipientAvatarSignedUrl = null;
            if (msg.recipient?.avatar) {
              const recipientPhoto = await Photo.findById(msg.recipient.avatar).lean();

              if (recipientPhoto && recipientPhoto.key) {
                //console.log("recipientPhoto:",recipientPhoto)
                recipientAvatarSignedUrl = await getSingleSignedUrl(recipientPhoto.key);
                //console.log("recipientPhotoKEY:",recipientPhoto.key)
                //console.log("recipientAvatar:",recipientAvatarSignedUrl)
              }
             }
              // Return enriched message
              return {
                ...msg.toObject(),
                sender: {...msg.sender.toObject(), avatarSignedUrl: senderAvatarSignedUrl},
                recipient: {...msg.recipient.toObject(),avatarSignedUrl: recipientAvatarSignedUrl},
              };
            })
          );

        // console.log("Enriched Messages:", enrichedMessages);

   
    if (!messages.length) {
      return res.status(404).json({ error: 'No messages found in this conversation' });
    }

    res.status(200).json({ messages});
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getUserConversations = async (req, res) => {

  //console.log("The other route hit:", req.user.id)
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'lastName limitedProfile') .populate('lastMessage');

      //console.log("The other route hit:", conversations)

    if (!conversations.length) {
      return res.status(404).json({ error: 'No conversations found' });
    }

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
