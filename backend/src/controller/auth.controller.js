import * as Service from "../services/auth.service.js"

const getMeta = (req) => ({
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'Unknown'
});

export const register = async (req, res) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            user
        });
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res) => {
    try {
        const meta = getMeta(req);
        const { accesstoken, refreshtoken } = await AuthService.login(req.body, meta);

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

export const logout = (req, res) => {
    try {
        const refreshtoken = req.cookies.refreshtoken;
        if (refreshtoken) {
            await AuthService.logout(refreshtoken);
        }
        res.clearCookie('refreshtoken');
        res.status(200).json({ message: "Logged Out" });
    } catch (err) {
        next(err);
    }
}

export const ME= async (req,res)=>{
    res.status(200).json({ user: req.user });
}