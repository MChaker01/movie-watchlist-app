const Watchlist = require("../models/Watchlist");

const addToWatchlist = async (req, res) => {
  try {
    // 1. Extract userId from req.user (added by protect middleware)
    const userId = req.user._id; // Get from middleware
    // 2. Extract movie data from req.body (tmdbId, title, posterPath, releaseDate)
    const { tmdbId, title, posterPath, releaseDate } = req.body;
    // 3. Create watchlist item in database
    const watchlist = await Watchlist.create({
      userId,
      tmdbId,
      title,
      posterPath,
      releaseDate,
    });

    // 4. Return success with created item
    return res.status(201).json(watchlist);
  } catch (error) {
    // Handle duplicate error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Movie already in watchlist" });
    }

    // Handle validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error adding to watchlist:", error.message);
    return res.status(500).json({ message: "Failed to add to watchlist" });
  }
};

const getWatchlist = async (req, res) => {
  try {
    // 1. Extract userId from req.user
    const userId = req.user._id;
    // 2. Find all watchlist items for this user and Sort by creation date (newest first)
    const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });
    // 4. Return array
    return res.status(200).json(watchlist);
  } catch (error) {
    console.error("Error while fetching watchlist elements : ", error);
    return res.status(500).json({ message: "Error while fetching data." });
  }
};

const updateWatchlist = async (req, res) => {
  try {
    // 1. Extract watchlist item ID from req.params
    const { id } = req.params;
    // 2. Extract { watched } from req.body
    const { watched } = req.body;
    // 3. Find item and verify it belongs to current user
    const item = await Watchlist.findOneAndUpdate(
      { _id: id, userId: req.user._id }, // Must match BOTH
      { watched },
      { new: true } // Return updated document
    );

    if (!item) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 5. Return updated item
    return res.status(200).json(item);
  } catch (error) {
    console.error("Error while updating item : ", error);
    return res.status(500).json({ message: "Error while updating item." });
  }
};

const deleteFromWatchlist = async (req, res) => {
  try {
    // 1. Extract watchlist item ID from req.params
    const { id } = req.params;
    // 2. Find and delete (only if belongs to user)
    const item = await Watchlist.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // 3. Return success message
    return res.status(200).json({ message: "item deleted successfully", item });
  } catch (error) {
    // Handle errors
    console.error("Error while deleting item.", error);
    return res.status(500).json({ message: "Error while deleting item." });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
  updateWatchlist,
  deleteFromWatchlist,
};
