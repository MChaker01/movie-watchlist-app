import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Fetch movie details from /movies/:tmdbId
        const movieResponse = await api.get(`/movies/${id}`);
        // 2. Fetch reviews from /reviews/movie/:tmdbId
        const reviewsResponse = await api.get(`/reviews/movie/${id}`);

        setMovie(movieResponse.data.results);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error while fetching Movie details", error);
        setError(
          error.response?.data?.message || "Failed to load movie details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Step 1: Validation - at least one field must have value
    const hasRating = rating !== null && rating !== "";
    const hasComment = comment.trim() !== "";

    if (!hasComment && !hasRating) {
      setError("Please provide either a rating or a comment");
      return;
    }

    try {
      // Step 2: API Call - POST to /reviews
      const response = await api.post("/reviews/", {
        tmdbId: id,
        reviewText: comment,
        rating: rating ? Number(rating) : null,
      });

      // Step 3: Add new review to the TOP of reviews array
      setReviews([response.data, ...reviews]);

      // Step 4: Reset form
      setRating(null);
      setComment("");
    } catch (error) {
      console.error("Error while adding review.", error);
      setError(error.response?.data?.message || "Error while adding review");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-px">
      {loading && (
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && loading === false && movie === null && (
        <div className="max-w-4xl mx-auto mt-10 rounded-xl bg-red-500/10 border border-red-500/30 px-6 py-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && movie && (
        <>
          {/* Backdrop */}
          <div className="relative h-[85vh] overflow-hidden">
            <img
              src={
                movie.posterPath
                  ? `https://image.tmdb.org/t/p/original${movie.posterPath}`
                  : "https://via.placeholder.com/1280x720/cccccc/969696?text=No+Image"
              }
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />

            {/* Foreground content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-20">
              <div className="flex flex-col md:flex-row gap-10 items-end">
                {/* Full poster */}
                <div className="w-56 shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                  <img
                    src={
                      movie.posterPath
                        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                        : "https://via.placeholder.com/500x750/cccccc/969696?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-full object-contain bg-black"
                  />
                </div>

                {/* Text */}
                <div className="max-w-2xl">
                  <h1 className="text-5xl font-semibold tracking-tight">
                    {movie.title}
                  </h1>
                  <p className="mt-3 text-neutral-400">
                    {movie.releaseDate?.split("-")[0]}
                  </p>
                  <p className="mt-6 text-neutral-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="max-w-6xl mx-auto px-6 py-20 space-y-20">
            {/* Review form */}
            {user && (
              <form
                onSubmit={handleSubmit}
                className="max-w-3xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              >
                <h2 className="text-2xl font-semibold mb-6">Add your review</h2>

                {error && (
                  <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm text-neutral-400 mb-2">
                    Rating (1–10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating || ""}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-24 bg-transparent border-b border-neutral-700 px-2 py-1 text-white focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <textarea
                  placeholder="Write your thoughts about the movie..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-32 bg-transparent border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition resize-none"
                />

                <button
                  type="submit"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
                >
                  Publish review
                </button>
              </form>
            )}

            {/* Reviews */}
            {!error && (
              <div className="max-w-4xl space-y-10">
                <h2 className="text-3xl font-semibold">Reviews</h2>

                {reviews.length === 0 ? (
                  <p className="text-neutral-400">
                    No reviews yet. Be the first to leave your mark.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-2xl bg-white/5 border border-white/10 p-6"
                      >
                        {review.rating && (
                          <div className="mb-2 text-sm font-semibold text-amber-400">
                            Rating: {review.rating}/10
                          </div>
                        )}
                        <p className="text-neutral-300 leading-relaxed">
                          {review.reviewText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default MovieDetails;
