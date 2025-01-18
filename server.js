const app = require('./app');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const logger = require('./utils/logger');
const dotenv=require("dotenv")
dotenv.config()//

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
//ocnstructing URL for connection
const mongodb_connection_string = () => {
  const { DB_CLUSTER, DB_NAME, DB_USER, DB_PSWD } = process.env;
  return`mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}; 

//Function to connect to Mongodb
const mongodb_connection = async () => {
  //Establish database connection
  try {
    const connection_string = mongodb_connection_string();
    await mongoose.connect(connection_string);
  /*   app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    }); */
    
    console.log("connected to mongodb", connection_string)
  } catch (err) {
    console.error(err);
    //throw new err();
  }
};

mongodb_connection();

/* mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  }); */


// Create HTTP and WebSocket servers
const server = http.createServer(app);

// Health Check Route
/* app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Poki backend is running!' });
}); */
// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store clients in conversation-specific groups
const conversationClients = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
 
  // Handle incoming messages
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));
  
     ws.on('message', async (message) => {
      console.log(`Received message server: ${message}`);
      console.log('Raw message received server:', message);
      console.log("HELLOW FROM SERVER ")
  
      try {
       const messageString = Buffer.isBuffer(message) ? message.toString() : message;
        const parsedMessage = JSON.parse(messageString);
        //const {recipient: recipientId, content } = parsedMessage;
        const sender = await User.findById(parsedMessage.sender);
        const recipient = await User.findById(parsedMessage.recipient);

        if (!sender || !recipient) {
          console.error('Sender or Recipient not found in the database.');
          return;
        }
        const newMessage = {
          _id: parsedMessage._id.startsWith('temp-') ? new ObjectId().toString() : parsedMessage._id,
          content: parsedMessage.content,
          sender: { _id: sender._id, firstName: sender.firstName, avatar: sender.avatar },
          recipient: { _id: recipient._id, firstName: recipient.firstName, avatar: recipient.avatar },
          createdAt: new Date().toISOString(),
        };

        console.log("SERVERNEWMESSAGE:", newMessage)
      
          // Broadcast only chat messages
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
      } catch (error) {
        console.error('Invalid JSON message received:', message);
      }

    });
 
  

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    // Remove the client from all conversation groups
    conversationClients.forEach((clients, conversationId) => {
      clients.delete(ws);
      if (clients.size === 0) {
        conversationClients.delete(conversationId);
      }
    });
  });


  // Send a welcome message to the newly connected client
  ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));


});

// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

