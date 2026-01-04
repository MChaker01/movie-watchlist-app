// 1. Imports (express, controller)
const express = require("express");
const {
  searchMovies,
  getMovieDetails,
} = require("../controllers/movieController");

// 2. Create router
const router = express.Router();

// 3. Define routes:
//    - GET /search?query=...
//    - GET /:tmdbId
router.get("/search", searchMovies);
router.get("/:tmdbId", getMovieDetails);

// 4. Export router
module.exports = router;
