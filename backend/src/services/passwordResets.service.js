import prisma from "../lib/prisma.js"
import { AppError } from "../utils/AppError.js"
import { sendPasswordResetEmail } from "../utils/emailsender.js"
import { hashToken } from "../utils/hash.js"
import { generateOTP } from "../utils/jwt.js"
import bcrypt from "bcrypt"


export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new AppError("No registered Email", 404)

    const OTP = generateOTP()
    const hashOTP = hashToken(OTP)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.PasswordReset.deleteMany({ where: { userId: user.id } })

    await prisma.PasswordReset.create({
        data: {
            userId: user.id, tokenHash: hashOTP, expiresAt
        }
    })

    await sendPasswordResetEmail(email, OTP)
}

export const resetPassword = async (email, otp, newpassword) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError("Invalid Request", 400)

    const otphash = hashToken(otp)

    const res = await prisma.PasswordReset.findFirst({
        where: { userId: user.id, used: false },
        orderBy: { expiresAt: 'desc' }
    })

    if (!res) throw new AppError("Expired OTP", 400)

    if (res.attempts >= 5) throw new AppError("Too Many Attempts", 400);
    if (new Date(res.expiresAt) < new Date()) throw new AppError("Expired OTP", 400);

    if (res.tokenHash !== otphash) {
        await prisma.PasswordReset.update({
            where: { id: res.id },
            data: { attempts: res.attempts + 1 }
        });
        throw new AppError("Incorrect OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await prisma.$transaction([
        prisma.PasswordReset.update({
            where: { id: res.id },
            data: { used: true }
        }),
        prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        }),
        prisma.RefreshToken.deleteMany({
            where: { userId: user.id }
        })
    ]);
}