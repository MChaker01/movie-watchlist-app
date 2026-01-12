const MovieCard = ({ movie }) => {
  const year = movie.releaseDate?.split("-")[0];
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://via.placeholder.com/500x750/cccccc/969696?text=No+Image";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <p className="text-gray-400 text-sm">{year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
