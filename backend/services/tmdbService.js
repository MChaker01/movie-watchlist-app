const axios = require("axios");

// 2. Create axios instance with base config
const tmdbAPI = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY, // Automatically added to all requests
  },
});

// 3. Function: searchMovies(query) -- Search movies by title
const searchMovies = async (query) => {
  try {
    // GET request to /search/movie
    const response = await tmdbAPI.get("/search/movie", {
      params: { query }, // Adds ?query=inception to URL
    });

    // Mapping response to clean format

    // response.data.results is an array like:
    // [{ id: 27205, title: "Inception", poster_path: "/abc.jpg", ... }, ...]

    //   "page": 1,
    //   "results": [        // ← Array of movies is HERE
    //     { "id": 27205, "title": "Inception", ... },
    //     { "id": 68718, "title": "Inception", ... }
    //   ],
    //   "total_results": 10
    // }

    const results = response.data.results;
    // results = [
    //   { id: 27205, title: "Inception", poster_path: "/abc.jpg", ... },
    //   { id: 68718, title: "Inception: The Cobol Job", poster_path: "/def.jpg", ... }
    // ]

    const ANIMATION_GENRE_ID = 16;

    // Transform EACH movie using .map()
    const movies = results
      .filter((movie) => {
        const hasPoster = movie.poster_path;
        const isNotAdult = !movie.adult;
        const isAnimation =
          movie.genre_ids && movie.genre_ids.includes(ANIMATION_GENRE_ID);

        return hasPoster && isNotAdult && isAnimation;
      })
      .map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        overview: movie.overview,
      }));
    // after .map() :
    // movies = [
    //   { tmdbId: 27205, title: "Inception", posterPath: "/abc.jpg", ... },
    //   { tmdbId: 68718, title: "Inception: The Cobol Job", posterPath: "/def.jpg", ... }
    // ]

    // Return array of movies
    return movies;
  } catch (error) {
    console.error("Error searching movies:", error.message);

    // If it's a specific API error, throw a custom message
    if (error.response?.status === 401) {
      throw new Error("Invalid TMDB API Key");
    }

    // Otherwise, throw the error so the controller handles it
    throw error;
  }
};

// 4. Function: getMovieDetails(tmdbId)
const getMovieDetails = async (tmdbId) => {
  try {
    //  GET request to /movie/{tmdbId}
    const response = await tmdbAPI.get(`/movie/${tmdbId}`);

    //  Mapping response to clean format
    // response.data is a SINGLE movie object, not an array

    const movie = {
      tmdbId: response.data.id,
      title: response.data.title,
      posterPath: response.data.poster_path,
      releaseDate: response.data.release_date,
      overview: response.data.overview,
    };

    // Return single movie object
    return movie;
  } catch (error) {
    console.error("Error fetching movie details:", error.message);
    throw new Error("Failed to fetch movie details from TMDB");
  }
};

// 5. Export functions
module.exports = { searchMovies, getMovieDetails };
