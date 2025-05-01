const API = import.meta.env.VITE_TMDB_APIKEY;
const AUTHAPI = import.meta.env.VITE_TMDB_AUTHKEY
const BASE_URL = 'https://api.themoviedb.org/3/'
export const fetchTopratedMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API}`);
    const data = await res.json();
    return data.results;
}
export const fetchPopularMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API}`);
    const data = await res.json();
    return data.results;
}
export const fetchUpcomingMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API}`);
    const data = await res.json();
    return data.results;
}


export const searchMovies = async (query) => {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${query}`);
    const data = await res.json();
    return data.results;
}


export const GuestLogin = async () => {
    const res = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new',
        {
            headers: {
                Authorization: `Bearer ${AUTHAPI}`,
                withCredentials: true,
            }
        }
    )
    return res.json();
}
;
  
  