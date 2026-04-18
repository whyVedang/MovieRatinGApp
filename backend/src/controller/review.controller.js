import prisma from "../lib/prisma.js"

export const writeReview = async (req, res) => {
    try {
        const { movieId, rating, content } = req.body
        const userId = req.user.id

        const review = await prisma.review.findFirst({
            where: { movieId, userId }
        })

        if (review) {
            return res.status(400).json({ message: "ALREADY REVIEWED" })
        }

        const newReview = await prisma.review.create({
            data: {
                movieId,
                rating,
                content,
                userId
            },
            include: {
                user: {
                    select: { username: true }
                }
            }
        })
        res.status(201).json(newReview)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllUserReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                user: {
                    select: { username: true }
                }
            }
        })

        if (!reviews.length) {
            return res.status(404).json({ message: "No Review Yet" })
        }

        res.status(200).json(reviews)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getUserReview = async (req, res) => {
    try {
        const { movieId } = parseInt(req.params.movieId)
        const userId = req.user.id

        const review = await prisma.review.findFirst({
            where: { movieId, userId }
        })

        res.status(200).json(review)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMovieReviews = async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId)

        const reviews = await prisma.review.findMany({
            where: { movieId },
            include: {
                user: {
                    select: { username: true }
                }
            }
        })

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews for this movie" })
        }

        res.status(200).json(reviews)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body
        const userId = req.user.id

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "You can only delete your own reviews" })
        }

        await prisma.review.delete({
            where: { id: reviewId }
        })

        res.status(200).json({ message: "Review deleted successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}