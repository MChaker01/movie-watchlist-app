const mongoose = require("mongoose");

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env file
    // process.env.DB_URI contains the MongoDB Atlas or local connection string
    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB connected Successfully.");
  } catch (error) {
    // If connection fails, log error and exit the application
    console.error("Error while Connecting to MongoDB.", error);
    process.exit(1); // Exit with failure code
  }
};

// Export the function to use in server.js
module.exports = connectDB;
