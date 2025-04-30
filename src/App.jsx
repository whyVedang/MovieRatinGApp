import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Favourite from "./Pages/Favourite";
import MovieDetail from "./Pages/MovieDetail";
import PageNotFound from "./Pages/PageNotFOund";
import Navbar from "./components/NavBar";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="favourites" element={<Favourite />} />
        <Route path="MovieDetail/:id" element={<MovieDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
