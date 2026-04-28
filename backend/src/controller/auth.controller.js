import * as Service from "../services/auth.service.js"
import * as PasswordService from "../services/passwordResets.service.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const getMeta = (req) => ({
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'Unknown'
});

export const register = asyncHandler(async (req, res) => {
    const user = await Service.register(req.body);
    res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        user
    });
});

export const login = asyncHandler(async (req, res) => {
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
});

export const logout = asyncHandler(async (req, res) => {
    const refreshtoken = req.cookies.refreshtoken;
    if (refreshtoken) {
        await Service.logout(refreshtoken);
    }
    res.clearCookie('refreshtoken');
    res.status(200).json({ message: "Logged Out" });
});

export const ME = asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
});

export const refresh = asyncHandler(async (req, res) => {
    const refreshtoken = req.cookies.refreshtoken;
    if (!refreshtoken) throw new AppError("No refresh token", 401);

    const meta = getMeta(req);
    const { newAccessToken, newRefreshToken } = await Service.refresh(refreshtoken, meta);

    res.cookie('refreshtoken', newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({ accesstoken: newAccessToken });
});

export const getSessions = asyncHandler(async (req, res) => {
    const session = await Service.getSessions(req.user.userId);
    res.status(200).json(session);
});

export const deleteSessions = asyncHandler(async (req, res) => {
    await Service.deleteSessions(req.user.userId, req.params.id);
    res.status(200).json({ message: "Session removed successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    await PasswordService.forgotPassword(req.body.email);
    res.status(200).json({ message: "Password reset email sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newpassword } = req.body;
    await PasswordService.resetPassword(email, otp, newpassword);
    res.status(200).json({ message: "Password reset successfully" });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    if (!token) throw new AppError("Token is required", 400);
    await Service.verifyEmail(token);
    res.status(200).json({ message: "Email verified successfully" });
});