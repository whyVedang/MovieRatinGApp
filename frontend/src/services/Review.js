const API= import.meta.env.VITE_BACKENDAPI

export const writeReview= async ({movieId,rating,content})=>{
    const res=await fetch(`${API}/movies/${movieId}/reviews`,{
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

export const getMovieReviews = async (movieId) => {
    const res = await fetch(`${API}/movies/${movieId}/reviews`)

    if (!res.ok) {
        throw new Error("Failed to fetch reviews")
    }

    return res.json()
}


export const getAllMyReview = async (movieId) => {
    const res = await fetch(`${API}/reviews/me`, {
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error("Failed to fetch your review")
    }

    return res.json()
}

export const deleteReview=async({movieId,reviewId})=>{
    const res = await fetch(`${API}/movies/${movieId}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return res.json();
};