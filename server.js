const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/user');
const dotenv = require('dotenv');
const Conversation = require('./models/conversationModel');
const Photo = require('./models/Photo');
const getSingleSignedUrl=require('./services/getSingleSignedUrl')

dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongodb_connection_string = () => {
  const { DB_CLUSTER, DB_NAME, DB_USER, DB_PSWD } = process.env;
  return `mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
};

const mongodb_connection = async () => {
  try {
    const connection_string = mongodb_connection_string();
    await mongoose.connect(connection_string);
    console.log('Connected to MongoDB:', connection_string);
  } catch (err) {
    console.error(err);
  }
};

mongodb_connection();

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to allow specific origins
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New Socket.IO connection:', socket.id);

  // Welcome message
  socket.emit('welcome', { message: 'Welcome to the Socket.IO server!' });

  // Handle incoming messages
  socket.on('message', async (data) => {
    console.log('Received message from client:', data);

    try {
      const { sender, recipient, content } = data;
      const senderUser = await User.findById(sender);
      const recipientUser = await User.findById(recipient);
       // Check if a conversation already exists
          

      if (!senderUser || !recipientUser) {
        console.error('Sender or recipient not found in the database.');
        return;
      }
      let conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] },
      });
      let recipientAvatarSignedUrl = null;
      let senderAvatarSignedUrl = null;

      

              if (senderUser?.avatar) {
                const senderPhoto = await Photo.findById(senderUser.avatar).lean();
                if (senderPhoto && senderPhoto.key) {
                  //console.log("SenderPhoto:",senderPhoto)
                  senderAvatarSignedUrl = await getSingleSignedUrl(senderPhoto.key);
                }
              }
      
              // Fetch recipient avatar URL
            if (recipientUser?.avatar) {
              const recipientPhoto = await Photo.findById(recipientUser.avatar).lean();

              if (recipientPhoto && recipientPhoto.key) {
                //console.log("recipientPhoto:",recipientPhoto)
                recipientAvatarSignedUrl = await getSingleSignedUrl(recipientPhoto.key);
                //console.log("recipientPhotoKEY:",recipientPhoto.key)
                //console.log("recipientAvatar:",recipientAvatarSignedUrl)
              }
             }

             senderAvatarSignedUrl && console.log("sendurl:", senderAvatarSignedUrl)
             recipientAvatarSignedUrl && console.log("sendurl:", recipientAvatarSignedUrl)
      const newMessage = {
        _id: data._id.startsWith('temp-') ? new mongoose.Types.ObjectId().toString() : data._id,
        conversationId: conversation._id  || null,
        content,
        sender: { _id: senderUser._id, firstName: senderUser.firstName,
           avatar:senderUser.avatar, senderAvatarSignedUrl },

        recipient: { _id: recipientUser._id, firstName: recipientUser.firstName,
           avatar:recipientUser.avatar, recipientAvatarSignedUrl },
        createdAt: new Date().toISOString(),
        type: 'chat',
      };

      console.log('SERVER NEW MESSAGE:', newMessage);

      // Broadcast message to all connected clients
      io.emit('newMessage', newMessage);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Socket.IO connection disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
