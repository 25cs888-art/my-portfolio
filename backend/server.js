const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, specify actual domain for security
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Attach socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Default API Check Route
app.get('/', (req, res) => {
  res.send('Task Management API is running smoothly.');
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Authenticated user joins their own private room
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room: user-${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    server.listen(PORT, () => {
      console.log(`Server is running smoothly on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });