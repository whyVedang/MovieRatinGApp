import bcrypt from "bcrypt"
import { prisma } from "../lib/prism"
import jwt  from "jsonwebtoken"

export const register=async (req,res)=>{
    try{
        const {username,password} =req.body
        if(await prisma.user.findUnique({where : {username} })) 
            {
                return res.status(400).json({message:"username taken"}) 
            }
        
        const salt=await bcrypt.genSalt(10)
        const hash=await bcrypt.hash(password,salt)
    
        const user=await prisma.user.create({
            data:{
                username,password:hash
            }
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username
            }
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login=async (req,res)=>{
    try{
        const {username,password} =req.body

        const user=await prisma.user.findUnique({where :{username}})

        if(!(user)) 
            {
                return res.status(404).json({message:"No Existing User Found"}) 
            }
        const passwordCheck =await bcrypt.compare(password,user.password);

        if(!passwordCheck)  return res.status(400).json({message:"Invalid Credentials"})

        const token=jwt.sign(
            {id:user.id},process.env.JWT_SECRET,{'expiresIn':'2d'}
        )

        res.cookie('token',token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            secure:process.env.NODE_ENV === 'production',
            sameSite:"strict"
        })

        const { password: userPassword, ...userInfo } = user;
        res.status(200).json({ 
            message: "Login successful", 
            user: userInfo 
        });

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout=(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({message : "Logged Out"})
}
