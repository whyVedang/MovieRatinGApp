const api= import.meta.env.VITE_BACKENDAPI

export const addFavorite=async(movieId)=>{
    const res=await fetch(`${api}/favorite`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
        credentials: 'include'
    });
    if(!res.ok) throw new Error("Failed to Add Favorite")
    return res.json();
}

export const fetchFavorite=async () => {
    const res=await fetch(`${api}/favorite`,{
        credentials:"include"
    })
    if(!res.ok) throw new Error("Failed to Fetch Favorite")
    return res.json();
    
}

export const removeFavorite=async (movieId) => {
    const res=await fetch(`${api}/favorite/${movieId}`,{
        method: 'DELETE',
        credentials: 'include'
    })
    
    if(!res.ok) throw new Error("Failed to Remove Favorite")
    return res.json();
}