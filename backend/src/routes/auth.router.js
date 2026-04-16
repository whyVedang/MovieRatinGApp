import express from "express"

import { register , login , logout , ME} from "../controller/auth.controller.js"
import { tokenVerify } from "../middleware/auth.middleware.js"
import { authRatelimiter } from "../utils/auth.ratelimiter.js"
import { validate } from "../middleware/validation.middleware.js"
import { authSchema } from "../utils/schema.validator.js"

const router=express.Router()

router.post('/register' ,authRatelimiter,validate(authSchema), register)
router.post('/login' ,authRatelimiter,validate(authSchema), login)
router.post('/logout' , logout)
router.get('/me' ,tokenVerify, ME)

export default router;