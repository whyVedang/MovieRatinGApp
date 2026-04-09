
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
