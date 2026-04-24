import express from "express"

import { register , login , logout , ME, refresh, getSessions, deleteSessions} from "../controller/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import { authRatelimiter } from "../utils/auth.ratelimiter.js"
import { validate } from "../middleware/validation.middleware.js"
import { authSchema, loginSchema } from "../utils/schema.validator.js"

const router=express.Router()

router.post('/register' ,authRatelimiter,validate(authSchema), register)
router.post('/login' ,authRatelimiter,validate(loginSchema), login)
router.post('/logout' , logout)
router.post('/refresh',refresh)

router.get('/me' ,protect, ME)
router.get('/sessions' ,protect, getSessions)
router.delete('/sessions/:id' ,protect, deleteSessions)



export default router;