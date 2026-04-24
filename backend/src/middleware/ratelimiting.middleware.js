import rateLimit from "express-rate-limit"

export const limiter=rateLimit({
    windowMs:10*60*1000,
    max:4,
    message:{message:"Tooo many attempts try again later "},
    standardHeaders:true,
    legacyHeaders:false
})
