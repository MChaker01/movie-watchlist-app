const tmdbService = require("../services/tmdbService");

const searchMovies = async (req, res) => {
  try {
    // 1. Extract query from req.query (e.g., ?query=inception)
    const { query } = req.query;
    // 2. Validate: Is query provided?
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // 3. Call tmdbService.searchMovies(query)
    const results = await tmdbService.searchMovies(query);

    // 4. Return results with 200 status
    return res.status(200).json({ results });
  } catch (error) {
    // Handle error
    console.error("Error in searchMovies:", error.message);
    return res.status(500).json({ message: "Failed to search movies" });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    // 1. Extract tmdbId from req.params (e.g., /movies/27205)
    const { tmdbId } = req.params;

    // 2. Call tmdbService.getMovieDetails(tmdbId)
    const results = await tmdbService.getMovieDetails(tmdbId);

    // 3. Return movie with 200 status
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching movie details:", error.message);
    return res.status(500).json({ message: "Failed to fetch movie details" });
  }
};

module.exports = { searchMovies, getMovieDetails };
