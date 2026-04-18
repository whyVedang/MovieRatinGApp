const API=import.meta.env.VITE_BACKENDAPI

export const writeReview= async ({movieId,rating,content})=>{
    const res=await fetch(`${API}/review`,{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:
        JSON.stringify({
            movieId:Number(movieId),
            rating:Number(rating),
            content
        }),

        credentials:'include'
    })
    
    console.log({movieId,rating,content})
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add review");
    }
    return res.json();
}

export const getReview=async(movieId)=>{
    const res=await fetch(`${API}/review/${movieId}`, {
        credentials: "include"
    });
    if(!res.ok) throw new Error("Failed to fetch reviews")
    return res.json()
}