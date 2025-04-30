import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const movies = [
    { title: "IMPOSSIBLE 69", actors: "TOM CRUISE, BENJI, REBECCA FERGUSSON, JEREMY RENNER", duration: "2H 45M", description: "LOREM IPSUM", id: 1 },
    { title: "MISSION 69", actors: "TOM CRUISE, BENJI, REBECCA FERGUSSON, JEREMY RENNER", duration: "2H 45M", description: "LOREM IPSUM", id: 2 },
    { title: "MISSION IMPOSSIBLE 69", actors: "TOM CRUISE, BENJI, REBECCA FERGUSSON, JEREMY RENNER", duration: "2H 45M", description: "LOREM IPSUM", id: 3 }
  ];

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredMovies.length > 0 ? (
        filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
}

export default Home;
