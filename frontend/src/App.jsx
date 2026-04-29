import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import Favourite from "./Pages/Favourite";
import Reviews from "./Pages/Reviews";
import MovieDetail from "./Pages/MovieDetail";
import NotFound from "./Pages/PageNotFound";
import Navbar from "./components/NavBar";
import Category from "./Pages/Category";
import Auth from "./auth/auth";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Landing page — standalone, no navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell with navbar */}
        <Route element={<Navbar />}>
          <Route path="/browse" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favourites" element={<Favourite />} />
            <Route path="/reviews" element={<Reviews />} />
          </Route>
          <Route path="/login" element={<Auth />} />
          <Route path="/MovieDetail/:id" element={<MovieDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
