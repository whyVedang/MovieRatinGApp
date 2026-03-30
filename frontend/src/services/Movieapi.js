
const api= import.meta.env.VITE_BACKENDAPI

export const fetchMovieDetails=async (id)=>{
   const res=await fetch(`${api}/movies/${id}`)
   if(res.ok) return res.json()
   else throw new Error("Failed to fetch Movie details")
}
export const fetchMovieCredits=async (id)=>{
    const res=await fetch(`${api}/movies/${id}/credits`)
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Movie details")

}
export const fetchMovieRecommendations=async (id)=>{
    const res=await fetch(`${api}/movies/${id}/recommendations`)
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Movie details")

}
export const fetchMovieReviews=async (id)=>{
    const res=await fetch(`${api}/movies/${id}/reviews`)
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Movie details")

}
export const fetchPopularMovies=async (page=1)=>{
    const res=await fetch(`${api}/movies/popular?page=${page}`);
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Popular Movies")
}
export const fetchTopRatedMovies=async (page=1)=>{
    const res=await fetch(`${api}/movies/top_rated?page=${page}`);
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Popular Movies")
}
export const fetchSearchMovies=async (search,page=1)=>{
    if(!search) return []
    const res=await fetch(`${api}/movies/search?page=${page}`);
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Popular Movies")
}
export const fetchUpcomingMovies=async (page=1)=>{
    const res=await fetch(`${api}/movies/upcoming?page=${page}`);
    if(res.ok) return res.json()
    else throw new Error("Failed to fetch Popular Movies")
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
