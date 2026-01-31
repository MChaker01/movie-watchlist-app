import React, { useEffect, useState } from "react";
import api from "../services/api";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null); // Which review we're editing.
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");

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

  const handleEditClick = (review) => {
    setIsModalOpen(true);
    setEditingReview(review);
    setEditRating(review.rating || "");
    setEditComment(review.reviewText || "");
  };

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error while deleting review.", error);
      setError(error.response?.data?.message || "Error while deleting review.");
    }
  };

  const handleSaveEdit = async (e, reviewId) => {
    e.preventDefault();
    try {
      const updateReview = await api.patch(`/reviews/${reviewId}`, {
        rating: editRating,
        reviewText: editComment,
      });

      setReviews(
        reviews.map((review) =>
          review._id === reviewId ? updateReview.data : review,
        ),
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error while editing review.", error);
      setError(error.response?.data?.message || "Failed to edit this review.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    setEditRating("");
    setEditComment("");
  };

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

            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={handleCloseModal}
              >
                <div
                  className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-semibold mb-6">Edit Review</h2>

                  <form onSubmit={(e) => handleSaveEdit(e, editingReview._id)}>
                    {/* Rating Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-neutral-400 mb-2">
                        Rating (1–10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editRating || ""}
                        onChange={(e) => setEditRating(e.target.value)}
                        className="w-24 bg-transparent border-b border-neutral-700 px-2 py-1 text-white focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>

                    {/* Comment Textarea */}
                    <div className="mb-6">
                      <label className="block text-sm text-neutral-400 mb-2">
                        Your thoughts
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full h-32 bg-transparent border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition resize-none"
                        placeholder="Write your thoughts..."
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-end">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-linear-to-r from-amber-500 to-red-500 text-black font-semibold hover:opacity-90 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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

                        <div className="mt-6 flex items-center gap-3">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="
      inline-flex items-center gap-2
      px-4 py-2 rounded-lg
      border border-white/10
      text-sm text-neutral-300
      hover:bg-white/10 hover:text-white
      transition cursor-pointer
    "
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="
      inline-flex items-center gap-2
      px-4 py-2 rounded-lg
      border border-red-500/30
      text-sm text-red-400
      hover:bg-red-500/10 hover:text-red-300
      transition cursor-pointer
    "
                          >
                            Delete
                          </button>
                        </div>
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
