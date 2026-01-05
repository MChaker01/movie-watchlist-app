// 1. Imports (express, protect middleware, controller)
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToWatchlist,
  getWatchlist,
  updateWatchlist,
  deleteFromWatchlist,
} = require("../controllers/watchlistController");

// 2. Create router
const router = express.Router();

// 3. Define routes (ALL protected with middleware):
router.use(protect);
// POST/ → addToWatchlist
router.post("/", addToWatchlist);
// GET/ → getWatchlist
router.get("/", getWatchlist);
// PATCH  /:id → updateWatchlist
router.patch("/:id", updateWatchlist);
// DELETE /:id → deleteFromWatchlist
router.delete("/:id", deleteFromWatchlist);

// 4. Export router
module.exports = router;
