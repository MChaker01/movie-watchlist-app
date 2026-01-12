import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlist from "./pages/Watchlist";
import SearchMovies from "./pages/SearchMovies";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<SearchMovies />} />

        {/* Protected routes wrapped in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/watchlist" element={<Watchlist />} />
          {/* <Route path="/my-reviews" element={<MyReviews />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
