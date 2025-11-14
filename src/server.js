// src/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/userRoutes'); // Import the user routes

// Initialize dotenv
dotenv.config();

// Connect to Database
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('Mbale Innovators Hub API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // <-- AND ADD THIS
app.use('/api/users', userRoutes); // Mount the user routes

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections and other cleanup
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown for nodemon restarts
process.on('SIGINT', () => server.close(() => process.exit(0)));
