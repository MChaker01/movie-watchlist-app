// 1. Imports (express, controller)
const express = require("express");
const {
  createReview,
  getMovieReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
// 2. Create router
const router = express.Router();

// 3. Define routes:
// Public route (no auth)
router.get("/movie/:tmdbId", getMovieReviews);

// Protected routes (need auth)
router.use(protect);
router.post("/", createReview);
router.get("/user", getUserReviews);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

// 4. Export router
module.exports = router;
