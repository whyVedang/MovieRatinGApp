import rateLimit from "express-rate-limit"

export const authRatelimiter=rateLimit({
    windowMs:5*60*1000,
    max:3,
    message:{message:"Too Many Attempts . Try Later"},
    standardHeaders:true,
    legacyHeaders:false
})