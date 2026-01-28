import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const MovieCard = ({
  movie,
  initialInWatchlist,
  onAddToWatchlist,
  mode = "search",
  onDelete,
  onToggleWatched,
}) => {
  // ═══════════════════════════════════════════════════════════
  // PROPS EXPLANATION
  // ═══════════════════════════════════════════════════════════
  // movie: Object with {tmdbId, title, posterPath, releaseDate, overview}
  // initialInWatchlist: Boolean - is this movie already saved?
  // onAddToWatchlist: Function from parent to update watchlistIds Set

  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  // Track if movie is added to watchlist (local UI state)
  const [isAdded, setIsAdded] = useState(initialInWatchlist);

  // Error message for this specific card
  const [error, setError] = useState("");

  // Get current user from AuthContext
  const { user } = useAuth();

  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════
  // DATA PREPARATION
  // ═══════════════════════════════════════════════════════════

  // Extract year from releaseDate (format: "2010-07-16" → "2010")
  const year = movie.releaseDate?.split("-")[0];

  // Build full poster URL or use placeholder if no poster exists
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://via.placeholder.com/500x750/cccccc/969696?text=No+Image";

  // ═══════════════════════════════════════════════════════════
  // HANDLER: Add movie to watchlist
  // ═══════════════════════════════════════════════════════════
  const handleAddToWatchlist = async (e) => {
    // Prevent event from bubbling up to parent elements
    e.stopPropagation();

    // Clear any previous error
    setError("");

    // ──────────────────────────────────────────────────────────
    // CHECK: Is user authenticated?
    // ──────────────────────────────────────────────────────────
    if (!user) {
      setError("Please login to add movies to watchlist");
      return; // Stop execution
    }

    try {
      // ──────────────────────────────────────────────────────
      // API CALL: Add movie to user's watchlist
      // ──────────────────────────────────────────────────────
      await api.post("/watchlist", movie);

      // ──────────────────────────────────────────────────────
      // SUCCESS: Update UI state
      // ──────────────────────────────────────────────────────
      setIsAdded(true); // Show "Saved" button

      // Notify parent component to update its watchlistIds Set
      // This keeps SearchMovies' Set synchronized
      if (onAddToWatchlist) {
        onAddToWatchlist(movie.tmdbId);
      }
    } catch (error) {
      console.error("Error adding to watchlist", error);

      // ──────────────────────────────────────────────────────
      // ERROR HANDLING: Different responses for different errors
      // ──────────────────────────────────────────────────────
      if (error.response?.status === 409) {
        // 409 Conflict: Movie already in watchlist
        setError("Movie already in watchlist!");
        setIsAdded(true); // Treat as "added" visually
      } else if (error.response?.status === 401) {
        // 401 Unauthorized: Token expired or invalid
        setError("Please login again");
      } else {
        // Other errors (500, network issues, etc.)
        setError("Failed to add movie. Try again.");
      }
    }
  };

  const handleClick = () => {
    navigate(`/movies/${movie.tmdbId}`);
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-300 cursor-pointer"
    >
      {/* ═══════════════════════════════════════════════════════
          POSTER IMAGE 
      ════════════════════════════════════════════════════════ */}
      <div className="relative h-90 overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-90" />

        {/* SEARCH MODE: Show Add to Watchlist button */}
        {mode === "search" && (
          <button
            onClick={handleAddToWatchlist}
            disabled={isAdded}
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs cursor-pointer font-semibold backdrop-blur-md transition ${
              isAdded
                ? "bg-green-500/90 text-black"
                : "bg-amber-500/90 text-black hover:bg-amber-400"
            }`}
          >
            {isAdded ? "Saved" : "+ Watchlist"}
          </button>
        )}

        {/* WATCHLIST MODE: Show Delete + Watched buttons */}
        {mode === "watchlist" && (
          <>
            {/* Delete Button - Top Right */}
            <button
              onClick={(e) => onDelete(e, movie._id)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-red-500/90 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>

            {/* Watched Toggle - Top Left */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie._id, movie.watched);
              }}
              className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                movie.watched
                  ? "bg-green-500/90 text-black"
                  : "bg-neutral-700/90 text-white hover:bg-neutral-600"
              }`}
            >
              {movie.watched ? "✓ Watched" : "Mark Watched"}
            </button>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOVIE INFO 
      ════════════════════════════════════════════════════════ */}
      <div className="p-4">
        <h3 className="text-sm font-semibold leading-tight text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="mt-1 text-xs text-neutral-400">{year}</p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ERROR MESSAGE (shown as overlay at bottom of card)
      ════════════════════════════════════════════════════════ */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 px-3 py-2 text-xs text-white text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
