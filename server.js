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

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
 

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    console.log('Authorization Header:', req.headers['authorization']);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');
});


// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

