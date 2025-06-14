require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'https://astro-talk-backend.onrender.com/',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors({
  origin: 'https://astro-talk-backend.onrender.com/',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/upload', express.static('upload'));

// Routes
const allRoutes = require('./App/index');
app.use(allRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: true, msg: 'API is working and connected to database' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Connected to MongoDB`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Socket.IO Logic
// io.on('connection', (socket) => {
//   console.log('🟢 New client connected:', socket.id);

//   // Join astrologer's private room
//   socket.on('join-room', ({ userType, astrologerId }) => {
//     if (userType === 'astrologer' && astrologerId) {
//       socket.join(`astrologer-${astrologerId}`);
//       console.log(`🔔 Astrologer joined room: astrologer-${astrologerId}`);
//     }
//   });

//   // User initiates call to astrologer
//   socket.on('start-call', ({ astrologerId, userId, channelName, token, uid }) => {
//     console.log(`📞 User ${userId} is calling astrologer ${astrologerId}`);
//     io.to(`astrologer-${astrologerId}`).emit('incoming-call', {
//       userId,
//       channelName,
//       token,
//       uid,
//     });
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('🔴 Client disconnected:', socket.id);
//   });
// });
