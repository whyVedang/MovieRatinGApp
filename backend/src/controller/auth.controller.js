import * as Service from "../services/auth.service.js"
import * as PasswordService from "../services/passwordResets.service.js"

const getMeta = (req) => ({
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'Unknown'
});

export const register = async (req, res,next) => {
    try {
        const user = await Service.register(req.body);
        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            user
        });
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res,next) => {
    try {
        const meta = getMeta(req);
        const { accesstoken, refreshtoken } = await Service.login(req.body, meta);

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Login successful",
            accesstoken 
        });
    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res,next) => {
    try {
        const refreshtoken = req.cookies.refreshtoken;
        if (refreshtoken) {
            await Service.logout(refreshtoken);
        }
        res.clearCookie('refreshtoken');
        res.status(200).json({ message: "Logged Out" });
    } catch (err) {
        next(err);
    }
}

export const ME= async (req,res,next)=>{
    res.status(200).json({ user: req.user });
}

export const refresh=async(req,res)=>{
    try{
    const refreshtoken=req.cookies.refreshtoken

    if(!refreshtoken) return res.status(401).json({message: "No refresh token"})

    const meta=getMeta(req)
    const {newAccessToken, newRefreshToken}=await Service.refresh(refreshtoken,meta)

    res.cookie('refreshtoken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({ accesstoken: newAccessToken });
    } catch (err) {
        next(err);
    }
}

export const getSessions=async(req,res,next)=>{
    try
    {
        const session=await Service.getSessions(req.user.userId)
        res.status(200).json(session)
    }
    catch(err)
    {
        next(err)
    }
}

export const deleteSessions=async(req,res,next)=>{
    try{
        await Service.deleteSessions(req.user.userId,req.params.id)
        res.status(200).json({ message: "Session removed successfully" })
    }
    catch(err)
    {
        next(err)
    }
}

export const forgotPassword=async(req,res,next)=>{
    try{
        await PasswordService.forgotPassword(req.body.email)
        res.status(200).json({message:"Password reset email sent"})
    }
    catch(err){
        next(err)
    }
}
export const resetPassword=async(req,res,next)=>{
    try{
        const {email,otp,newpassword}=req.body
        await PasswordService.resetPassword(email,otp,newpassword)
        res.status(200).json({message:"Password reset successfully"})
    }
    catch(err){
        next(err)
    }
}

export const verifyEmail=async(req,res,next)=>{
    try {
        const { token } = req.query
        if (!token) throw new AppError("Token is required", 400)
        await Service.verifyEmail(token)
        res.status(200).json({ message: "Email verified successfully" })
    } catch (err) {
        next(err)
    }
}