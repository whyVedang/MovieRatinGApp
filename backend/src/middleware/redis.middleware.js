import client from "../redis/redis.js";

export const cacheMovies=async (req,res,next)=>{
    
    if (req.method !== "GET") next();
    
    const key=req.originalUrl;


    try{
        const data=await client.get(key)
        if (data) {
            console.log(`CACHE HIT: ${key}`);
            return res.status(200).json(JSON.parse(data));
        }

        console.log(`CACHE MISS: ${key}`);
        
        const originalSend = res.json.bind(res);
        
        res.json = (data) => {
            try{
                client.setEx(key, 3600, JSON.stringify(data));
            }
            catch(e){
                console.error("Redis SET error:", e);
            }
            originalSend(data);
        };
        next()
    }
    catch(err)
    {
        console.error("Redis Cache Error:", err);
        next();
    }

}