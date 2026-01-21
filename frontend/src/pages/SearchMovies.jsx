import React, { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";

const SearchMovies = () => {
  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  // Search query input from user
  const [query, setQuery] = useState("");

  // Array of movies returned from TMDb API
  const [movies, setMovies] = useState([]);

  // Loading state for search request
  const [loading, setLoading] = useState(false);

  // Error message to display
  const [error, setError] = useState("");

  // Set of tmdbIds that are already in user's watchlist
  // Using Set for O(1) lookup performance (faster than Array.includes)
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  // Get current user from AuthContext
  const { user } = useAuth();

  // ═══════════════════════════════════════════════════════════
  // EFFECT: FETCH WATCHLIST IDS ON MOUNT (if user is logged in)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchIds = async () => {
      // Get user's watchlist from backend
      const response = await api.get("/watchlist");

      // Extract just the tmdbIds from array of objects
      // Example: [{tmdbId: 1, ...}, {tmdbId: 2}] → [1, 2]
      // Then convert to Set for fast lookups
      const ids = new Set(response.data.map((item) => item.tmdbId));

      // Update state with Set of IDs
      setWatchlistIds(ids);
    };

    // Only fetch if user is authenticated
    if (user) {
      fetchIds();
    }
  }, [user]); // Re-run if user changes (login/logout)

  // ═══════════════════════════════════════════════════════════
  // CALLBACK FUNCTION: Update watchlistIds when child adds movie
  // ═══════════════════════════════════════════════════════════
  const addToWatchlistIds = (tmdbId) => {
    // Create NEW Set with existing IDs + new ID
    // Spread operator [...prev] converts Set to Array
    // Then wrap in new Set() to remove duplicates
    setWatchlistIds((prev) => new Set([...prev, tmdbId]));
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLER: Search movies when form is submitted
  // ═══════════════════════════════════════════════════════════
  const handleSearch = async (e) => {
    // Prevent default form submission (page refresh)
    e.preventDefault();

    // Validate: Can't search with empty query
    if (!query.trim()) {
      setError("Enter a movie name please!");
      return;
    }

    // Clear previous error
    setError("");

    // Show loading indicator
    setLoading(true);

    try {
      // Call backend API: GET /api/movies/search?query=inception
      const response = await api.get("/movies/search", {
        params: { query }, // Axios converts this to ?query=value
      });

      // Update state with search results
      setMovies(response.data.results);
    } catch (error) {
      // Show error message to user
      setError("Failed to search movies");
      console.error(error);
    } finally {
      // Hide loading indicator (runs whether success or error)
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        {/* ═══════════════════════════════════════════════════════
            HEADER 
        ════════════════════════════════════════════════════════ */}
        <div className="max-w-3xl mb-14">
          <h1 className="text-5xl font-semibold tracking-tight">
            Discover movies
          </h1>
          <p className="mt-3 text-neutral-400">
            Search, explore, and build your personal watchlist
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SEARCH FORM 
        ════════════════════════════════════════════════════════ */}
        <form onSubmit={handleSearch} className="mb-16">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-lg">
            {/* Search input - controlled component */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie title..."
              className="flex-1 bg-transparent text-lg text-white placeholder-neutral-500 focus:outline-none"
            />

            {/* Submit button - disabled while loading */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-red-500 text-black font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* ═══════════════════════════════════════════════════════
            ERROR MESSAGE 
        ════════════════════════════════════════════════════════ */}
        {error && (
          <div className="mb-10 rounded-xl bg-red-500/10 border border-red-500/30 px-6 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            LOADING SPINNER 
        ════════════════════════════════════════════════════════ */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MOVIE RESULTS GRID 
        ════════════════════════════════════════════════════════ */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                movie={movie}
                mode="search"
                // Check if this movie is already in watchlist (O(1) lookup)
                initialInWatchlist={watchlistIds.has(movie.tmdbId)}
                // Pass callback so child can update parent's Set
                onAddToWatchlist={addToWatchlistIds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovies;
