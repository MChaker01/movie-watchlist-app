import React, { useEffect, useState } from "react";
import api from "../services/api";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Step 1: Get reviews
        const response = await api.get("/reviews/user");
        setReviews(response.data);

        // Step 2: Get unique movie IDs
        const tmdbIds = [...new Set(response.data.map((r) => r.tmdbId))];

        // Step 3: Fetch all movies at once
        const moviePromises = tmdbIds.map((tmdbId) =>
          api.get(`/movies/${tmdbId}`),
        );

        const movieResponse = await Promise.all(moviePromises);

        // Step 4: Build lookup object
        const moviesMap = {};
        movieResponse.forEach((res, index) => {
          moviesMap[tmdbIds[index]] = res.data.results;
        });

        setMovies(moviesMap);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load your reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-semibold tracking-tight">My Reviews</h1>
          <p className="mt-2 text-neutral-400">
            A personal record of what you've watched and felt
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-6 py-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mb-10 text-neutral-400">
              You have{" "}
              <span className="text-white font-medium">{reviews.length}</span>{" "}
              reviews.
            </p>

            <div className="space-y-6">
              {reviews.map((review) => {
                const movie = movies[review.tmdbId];

                return (
                  <div
                    key={review._id}
                    className="flex gap-6 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl"
                  >
                    {/* Poster */}
                    <div className="w-24 shrink-0">
                      {movie?.posterPath ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                          alt={movie.title}
                          className="rounded-xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-36 rounded-xl bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {movie ? (
                        <>
                          <h3 className="text-lg font-semibold">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-neutral-400">
                            {movie.releaseDate?.split("-")[0]}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-neutral-400">
                          Movie ID: {review.tmdbId}
                        </p>
                      )}

                      <div className="mt-4 space-y-2">
                        <p className="text-sm">
                          <span className="text-neutral-400">Rating:</span>{" "}
                          {review.rating ? (
                            <span className="text-amber-400 font-semibold">
                              {review.rating}/10
                            </span>
                          ) : (
                            <span className="text-neutral-500">No rating</span>
                          )}
                        </p>

                        <p className="text-neutral-300 leading-relaxed">
                          {review.reviewText || (
                            <span className="text-neutral-500">
                              No written review.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
