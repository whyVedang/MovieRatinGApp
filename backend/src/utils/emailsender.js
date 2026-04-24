import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../configenv.js";

const transporter=nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  }); 


export const sendVerificationEmail = async (email, token) => {
  const url = `http://localhost:5173/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to MovieMate - Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to MovieMate! 🎬</h2>
        <p>Click the button below to verify your account and start reviewing movies:</p>
        <a href="${url}" style="background: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "MovieMate - Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your one-time password (OTP) to reset your account is:</p>
        <h1 style="letter-spacing: 5px; color: #e50914;">${otp}</h1>
        <p style="color: #666;">This code will expire in 15 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};