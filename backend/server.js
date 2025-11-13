const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ⭐ Attach Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(6969, () => {
      console.log(`Server is running on http://localhost:6969`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Server:', error.message);
  });
