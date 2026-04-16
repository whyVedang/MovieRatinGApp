import express from "express"

import { getFavorite , addFavorite ,removeFavorite} from "../controller/fav.controller.js"
import {tokenVerify}  from '../middleware/auth.middleware.js';
import { validate } from "../middleware/validation.middleware.js";
import { favSchema } from "../utils/schema.validator.js";


const router=express.Router()

router.post('/', tokenVerify,validate(favSchema), addFavorite );
router.get('/', tokenVerify, getFavorite);
router.delete('/:movieId', tokenVerify, removeFavorite);

export default router;