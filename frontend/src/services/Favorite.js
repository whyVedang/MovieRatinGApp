const api= import.meta.env.VITE_BACKENDAPI

export const getAuthHeaders = () => {
    const token = localStorage.getItem("movie_mate_token");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const addFavorite=async(movieId)=>{
    const res=await fetch(`${api}/favorite`,{
        method:"POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ movieId }),
        credentials: 'include'
    });
    if(!res.ok) throw new Error("Failed to Add Favorite")
    return res.json();
}

export const fetchFavorite=async () => {
    const res=await fetch(`${api}/favorite`,{
        method:"GET",
        headers: getAuthHeaders(),
        credentials:"include"
    })
    if(!res.ok) throw new Error("Failed to Fetch Favorite")
    return res.json();
    
}

export const removeFavorite=async (movieId) => {
    const res=await fetch(`${api}/favorite/${movieId}`,{
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
    })
    
    if(!res.ok) throw new Error("Failed to Add Favorite")
    return res.json();
}