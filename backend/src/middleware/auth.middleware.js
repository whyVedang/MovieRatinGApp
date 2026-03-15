import { configDotenv } from "dotenv"
import jwt from "jsonwebtoken"

export const tokenVerify=(req,res,next)=>{
    const token=req.cookies.token

    if(!token){
        return res.status(401).json({message : " LOL "})
    }
    try{
        const verify=jwt.verify(token,configDotenv.JWT_SECRET)
        
        req.user=verified
        next()
    }
    catch(error) {
        res.status(403).json({message:"Invalid Token"})
    }
}