import express from "express"

import { register , login , logout , ME, refresh, getSessions, deleteSessions, forgotPassword, resetPassword, verifyEmail} from "../controller/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import { authRatelimiter } from "../utils/auth.ratelimiter.js"
import { validate } from "../middleware/validation.middleware.js"
import { authSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema } from "../utils/schema.validator.js"

const router=express.Router()

router.post('/register' ,authRatelimiter,validate(authSchema), register)
router.post('/login' ,authRatelimiter,validate(loginSchema), login)
router.post('/logout' , logout)
router.post('/refresh',refresh)

router.get('/me' ,protect, ME)
router.get('/sessions' ,protect, getSessions)
router.delete('/sessions/:id' ,protect, deleteSessions)

router.post('/forgot-password',authRatelimiter,validate(forgotPasswordSchema),forgotPassword)
router.post('/reset-password',authRatelimiter,validate(resetPasswordSchema),resetPassword)

router.get('/verify',verifyEmail)

export default router;