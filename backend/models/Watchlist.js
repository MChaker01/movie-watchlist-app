const mongoose = require("mongoose");

const WatchlistSchema = mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: [true, "tmdbId is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    posterPath: {
      type: String,
      required: [true, "poster path is required"],
    },
    releaseDate: {
      type: Date,
      required: [true, "release date is required"],
    },
    watched: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

WatchlistSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", WatchlistSchema);

module.exports = Watchlist;
