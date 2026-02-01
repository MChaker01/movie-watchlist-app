import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlist from "./pages/Watchlist";
import SearchMovies from "./pages/SearchMovies";
import GuestRoute from "./components/GuestRoute";
import MovieDetails from "./pages/MovieDetails";
import MyReviews from "./pages/MyReviews";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<SearchMovies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* Protected routes wrapped in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/my-reviews" element={<MyReviews />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
