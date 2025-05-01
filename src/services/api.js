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
            }
        }
    )
    return res.json();
}

export const GetRequestToken = async () => {
    const res = await fetch(
      'https://api.themoviedb.org/3/authentication/token/new',
      {
        headers: {
          Authorization: `Bearer ${AUTHAPI}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) throw new Error('Failed to get request token');
    return res.json();
  };


export const ValidateWithLogin = async ({ username, password, request_token }) => {
    const res = await fetch(
      `${BASE_URL}authentication/token/validate_with_login`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTHAPI}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, request_token }),
      }
    );
    if (!res.ok) throw new Error('Failed to validate login');
    return res.json();
  };


export const CreateSession = async ({ request_token }) => {
    const res = await fetch(
      'https://api.themoviedb.org/3/authentication/session/new',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTHAPI}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_token }),
      }
    );
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  };

  export const DeleteSession = async ({ session_id }) => {
    const res = await fetch(
      'https://api.themoviedb.org/3/authentication/session',
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AUTHAPI}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id }),
      }
    );
    
    if (!res.ok) throw new Error('Failed to delete session');
    return res.json();
  };