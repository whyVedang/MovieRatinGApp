import prisma from "../lib/prisma";

export const addFavorite=(async(req,res)=>{
    try{
        const {movieId}=req.body
        const userId=req.user.id

        const check= await prisma.favorite.findFirst({where:{movieId,userId}})
        if(check) return res.status(400).json({message:"Already in favorites"})
        const newFavorite = await prisma.favorite.create({
            data: {
                movieId,
                userId
            }
        });

        res.status(201).json(newFavorite);
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})
export const getFavorite=(async (req,res)=>{
    try{
        const userId=req.user.id

        const favorites=await prisma.favorite.findMany({where:userId})

        if(!favorites) res.status(404).json({message:"No Favorites Yet"})
    
        res.status(200).json(favorites);
        }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})
export const removeFavorite=(async (req,res)=>{
    try{
        const {movieId}=req.body
        const userId=req.user.id

        const favorite=prisma.favorite.findUnique({where:{movieId,userId}})
        if(!favorite) res.status(404).json({message:"No Favorites Yet"})
        
        const response=await prisma.favorite.delete({
            where: { movieId, userId }
        });
        res.status(200).json({ message: "Favorite removed" });
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})

