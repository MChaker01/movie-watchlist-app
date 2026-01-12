import React, { useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";

const SearchMovies = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    // Prevent page refresh
    e.preventDefault();

    // Validate the input (can't be empty)
    if (!query.trim()) {
      setError("Enter a movie name please!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call backend API: GET /movies/search?query=inception
      const response = await api.get("/movies/search?query=" + query);
      setMovies(response.data.results);
    } catch (error) {
      setError("Failed to search movies", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <h1 className="text-4xl font-bold mb-8">Search Movies</h1>

          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? "Searching ..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.tmdbId} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovies;
