// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
// This allows your React frontend (running on a different port)
// to make requests to this backend.
app.use(cors());

app.use(express.json());

// --- Database Connection ---

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    // Don't start listening for requests until the DB is connected
    app.listen(6969,() => {
    console.log(`Server is running on http://localhost:6969`);
});
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Server:', error.message);
  });

  

