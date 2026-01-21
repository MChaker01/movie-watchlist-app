import React, { useEffect, useState } from "react";
import api from "./../services/api";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setError("");
        const response = await api.get("/watchlist");

        setMovies(response.data);
      } catch (error) {
        console.error("Error while fetching watchlist movies", error);
        setError(
          error.response?.data?.message ||
            "Error while fetching watchlist movies",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setError("");

    try {
      await api.delete(`/watchlist/${id}`);
      const restMovies = movies.filter((movie) => movie._id !== id);
      setMovies(restMovies);
    } catch (error) {
      console.error("Error while deleting Movie from Watchlist", error);
      setError(
        error.response?.data?.message ||
          "Error while deleting Movie from Watchlist",
      );
    }
  };

  const handleToggleWatched = async (id, currentWatchedStatus) => {
    // more help please
    try {
      api.patch(`/watchlist/${id}`, { watched: !currentWatchedStatus });

      const updatedMovies = movies.map((movie) => {
        if (movie._id === id) {
          return {
            ...movie,
            watched: !movie.watched,
          };
        }
        return movie;
      });

      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error while updating watched status.", error);
      setError(error.response?.data?.message || "Error while updating status.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* HEADER */}
        <h1 className="text-5xl font-semibold mb-14">My Watchlist</h1>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && movies.length === 0 && (
          <p className="text-neutral-400">
            Your watchlist is empty. Start adding movies!
          </p>
        )}

        {/* MOVIE GRID */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id} // Why _id instead of tmdbId here?
                movie={movie}
                mode="watchlist"
                onDelete={handleDelete}
                onToggleWatched={handleToggleWatched}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
