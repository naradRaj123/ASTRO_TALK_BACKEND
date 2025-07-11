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



// Middlewares
app.use(cors({ origin: "*" }));
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


