import {z} from "zod"

export const authSchema=z.object({
    body:z.object({
        username:z.string().min(3, "Username must be at least 3 characters").max(20, "Username cant be more than 20 characters"),
        password:z.string().min(8, "Password must be at least 8 characters")
    })
})

export const favSchema=z.object({
    body:z.object({
        movieId: z.number().int().positive("Movie ID must be a valid positive number")
    })
}) 

export const reviewSchema=z.object({
    body:z.object({
        movieId: z.coerce.number().int().positive(),
        rating:z.coerce.number().int().min(1,"Rating must be at least 1 star").max(5,"Rating can't be more than 5 star"),
        content:z.string().min(5, "Review must be at least 5 characters").max(1000, "Review is too long")
    })
})