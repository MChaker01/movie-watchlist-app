// Import required packages
const express = require("express"); // Web framework for building REST APIs
const cors = require("cors"); // Enable Cross-Origin Resource Sharing (frontend-backend communication)
require("dotenv").config(); // Load environment variables from .env file
const connectDB = require("./config/db"); // Database connection function

// Initialize Express application
const app = express();

// Import route modules
const authRoutes = require("./routes/authRoutes"); // Authentication routes (register, login, getMe)
const movieRoutes = require("./routes/movieRoutes"); // Movie routes (search, details)
const watchlistRoutes = require("./routes/watchlistRoutes"); // Watchlist routes (addTowatchlist, getWatchlist, updateWatchlist, deleteFromWatchlist)
const reviewRoutes = require("./routes/reviewRoutes"); // review routes (createReview, getMovieReviews, getUserReviews, updateReview, deleteReview)

// Middleware Configuration
// Enable CORS - allows frontend (React) to make requests to backend
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

// Parse incoming JSON data in request body
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Route Mounting
// All auth routes will be prefixed with /api/auth
// Example: POST /api/auth/register, POST /api/auth/login
app.use("/api/auth", authRoutes);

// All movie routes will be prefixed with /api/movies
// Example: GET /api/movies/search, GET /api/movies/:tmdbId
app.use("/api/movies", movieRoutes);

// All watchlist routes will be prefixed with /api/watchlist
// Example: POST /api/watchlist, GET /api/watchlist, PATCH /api/watchlist/:id
app.use("/api/watchlist", watchlistRoutes);

// All review routes will be prefixed with /api/reviews
app.use("/api/reviews", reviewRoutes);

// Connect to MongoDB database, then start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

  // Start Express server and listen for incoming requests
  app.listen(PORT, () => {
    console.log(`Server is running on Port : ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
});
