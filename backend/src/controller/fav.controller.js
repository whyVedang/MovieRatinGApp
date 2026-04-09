import prisma from "../lib/prisma.js";

export const addFavorite = (async (req, res) => {
    try {
        const { movieId } = req.body
        const userId = req.user.id

        const MovieId = parseInt(movieId, 10);
        const check = await prisma.favorite.findFirst({ where: { movieId: MovieId, userId } })
        if (check) return res.status(400).json({ message: "Already in favorites" })
        const newFavorite = await prisma.favorite.create({
            data: {
                movieId: MovieId,
                userId
            }
        });

        res.status(201).json(newFavorite);
    }
    catch (error) {
        console.log(req.body)
        console.log("Add favorite error:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
export const getFavorite = (async (req, res) => {
    try {
        const userId = req.user.id

        const favorites = await prisma.favorite.findMany({ where: { userId } })

        if (!favorites) return res.status(404).json({ message: "No Favorites Yet" })

        res.status(200).json(favorites);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})
export const removeFavorite = (async (req, res) => {
    try {
        const { movieId } = req.params;
        const MovieId = parseInt(movieId, 10);
        const userId = req.user.id;

        const result = await prisma.favorite.deleteMany({
            where: {
                movieId: MovieId,
                userId: userId
            }
        });
        if (result.count === 0) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Favorite removed" });
    } catch (error) {
        console.error("Remove favorite error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

