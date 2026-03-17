import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

export const tokenVerify=(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message : " LOL "})
    }
    try{
        const verify=jwt.verify(token,process.env.JWT_SECRET)
        
        req.user=verify
        next()
    }
    catch(error) {
        res.status(403).json({message:"Invalid Token"})
    }
}