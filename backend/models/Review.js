const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    tmdbId: {
      type: Number,
      required: [true, "tmdbId is required"],
    },
    reviewText: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot exceed 10"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre("save", function (next) {
  // 'this' refers to the document being saved
  if (!this.reviewText && !this.rating) {
    // If BOTH are missing, throw error
    return next(new Error("Review must include either text or rating"));
  }
  next(); // Validation passed, continue saving
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
