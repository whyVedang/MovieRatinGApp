import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import prisma from "../lib/prisma.js"

import { hashToken } from "../utils/hash.js"
import { AppError } from "../utils/AppError.js"

const getExpirationDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const register = async (data) => {
    const { username, email, password } = data;
    if (await prisma.user.findUnique({ where: { OR: [{ username, email }] } })) {
        return res.status(400).json({ message: "Username or Email alr taken" })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            username, password: hash
        },
        select: { id: true, username: true, email: true, role: true }
    })

    const token = generateRefreshToken();
    const hashedToken = hashToken(token);

    await prisma.emailverification.create({
        data: {
            userId: user.id, token: hashedToken, expiresAt: getExpirationDate(1)
        }
    })

    return user;
}
export const login = async (data, meta) => {
    const { email, password } = data;
    const { ip, userAgent } = meta;

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError("Not a Registered User")

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid Credentials", 401);


    const accesstoken = generateAccessToken(user)
    const refreshtoken = generateRefreshToken()
    const hashrefresh = hashToken(refreshtoken)

    await prisma.refreshtoken.create({
        data: {
            userId: user.id,
            token: hashedrefresh,
            expiresAt: getExpirationDate(7),
            ip,
            userAgent
        }
    })

    return { accesstoken, refreshtoken }
}
export const logout = async (refreshtoken) => {
    if (!refreshtoken) throw new AppError("User not logged in", 401)

    const hashrefresh = hashToken(refreshtoken)
    
    try {
        await prisma.refreshToken.delete({ where: { token: hashrefresh } });
        return true;
    } catch (error) {
        throw new AppError("Invalid token or already logged out", 401);
    }
}

export const refresh=(refreshtoken,meta)=>{
    const { ip, userAgent } = meta;
    const hashrefresh = hashToken(refreshtoken);

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: hashrefresh },
        include: { user: true }
    });

    if (!storedToken) throw new AppError("Invalid refresh token", 401);

    if (new Date(storedToken.expiresAt) < new Date()) {
        await prisma.refreshToken.delete({ where: { token: hashrefresh } });
        throw new AppError("Refresh token expired", 401);
    }

    if (storedToken.used) {
        await prisma.refreshToken.deleteMany({ where: { userId: storedToken.userId } });
        console.error(`[BREACH DETECTED] Token reuse for user ${storedToken.userId}. All sessions revoked.`);
        throw new AppError("Security alert: Token reuse detected. Please log in again.", 403);
    }

    if (storedToken.userAgent !== userAgent) {
        await prisma.refreshToken.delete({ where: { token: hashrefresh } });
        console.error(`[ANOMALY - HIGH] User-Agent changed from ${storedToken.userAgent} to ${userAgent}`);
        throw new AppError("Session anomaly detected. Please log in again.", 403);
    }

    const newAccessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = generateRefreshToken();
    const newhashrefresh = hashToken(newRefreshToken);

    await prisma.$transaction([
        prisma.refreshToken.update({
            where: { token: hashrefresh },
            data: { used: true }
        }),
        prisma.refreshToken.create({
            data: {
                userId: storedToken.userId,
                token: newhashrefresh,
                expiresAt: getExpirationDate(7),
                ip,
                userAgent,
                lastUsed: new Date()
            }
        })
    ]);

    return { newAccessToken, newRefreshToken };
}

export const getSessions=(userId)=>{
    const session=await prisma.refreshtoken.findMany({
        where:{userId,used:false},
        orderBy:{lastUsed:'desc'}
    })

    if(session.length===0) throw new AppError("No Sessions",401)
    return session;
}
export const deleteSessions=(userId,sessionId)=>{
    try{

        await prisma.refreshtoken.delete({
            where:{id:sessionId,userId}
        })
    }catch(err)
    {
        throw new AppError("No sessions found",404)
    }
    
}
