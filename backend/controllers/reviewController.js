const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tmdbId, reviewText, rating } = req.body;

    // Basic validation (tmdbId is mandatory)
    if (!tmdbId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    // Create review (schema pre-save hook validates text/rating)
    const review = await Review.create({
      userId,
      tmdbId,
      reviewText,
      rating,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error.message);

    // If validation error, return 400
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create review" });
  }
};

const getMovieReviews = async (req, res) => {
  try {
    // 1. Extract tmdbId from req.params (route: /api/reviews/movie/:tmdbId)
    const { tmdbId } = req.params;

    // 2. Find all reviews for this movie
    //    - Filter: { tmdbId }
    //    - Populate: userId → username (so frontend can display reviewer name)
    //    - Sort: newest first
    const reviews = await Review.find({ tmdbId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // 3. Return array of reviews
    return res.status(200).json(reviews);
  } catch (error) {
    // Error handling
    console.error("Error while fetching reviews.", error);
    res.status(500).json({ message: "Error while fetching reviews." });
  }
};

const getUserReviews = async (req, res) => {
  try {
    // 1. Extract userId from req.user (middleware)
    const userId = req.user._id;
    // 2. Find all reviews by this user
    // 3. Sort by newest first
    const userReviews = await Review.find({ userId }).sort({ createdAt: -1 });

    // 4. Return array
    return res.status(200).json(userReviews);
  } catch (error) {
    console.error("Error while fetching user reviews", error);
    return res
      .status(500)
      .json({ message: "Error while fetching user reviews" });
  }
};

const updateReview = async (req, res) => {
  try {
    // 1. Extract review ID from req.params
    const { id } = req.params;
    // 2. Extract { reviewText, rating } from req.body
    const { reviewText, rating } = req.body;

    // Validate: At least one field must have a value
    const hasText = reviewText && reviewText.trim() !== "";
    const hasRating = rating !== null && rating !== undefined;

    if (!hasText && !hasRating) {
      return res
        .status(400)
        .json({ message: "Review must include either text or rating" });
    }
    
    // 3. Find and update (MUST match both _id AND userId for security)
    const updatedReview = await Review.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { reviewText, rating },
      { new: true, runValidators: true }
    );
    // 4. Check if review exists (if not, user tried to edit someone else's)
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    // 6. Return updated review
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error while updating review", error);
    return res.status(500).json({ message: "Error while updating review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    // 1. Extract review ID from req.params
    const { id } = req.params;
    // 2. Find and delete (MUST belong to current user)
    const deletedReview = await Review.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    // 3. Check if review exists
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    // 4. Return success message
    return res.status(200).json(deletedReview);
  } catch (error) {
    console.error("Error while deleting review", error);
    return res.status(500).json({ message: "Error while deleting review" });
  }
};

module.exports = {
  createReview,
  getMovieReviews,
  getUserReviews,
  updateReview,
  deleteReview,
};
