// Server setup for AstroTalk-like app using Express, MongoDB, and Socket.io

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();

// Create HTTP server for Socket.io
const http = require('http');
const server = http.createServer(app);

// Setup Socket.io with CORS
// const { Server } = require('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// Export io if you want to use it in other files
// module.exports.io = io;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // optional if sending large payloads

// Static folder for uploaded files
app.use('/upload', express.static('upload'));

// Import and use all routes
const allRoutes = require('./App/index');
app.use(allRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: true, msg: 'API is working and connected to database' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✅ Connected to MongoDB`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});


