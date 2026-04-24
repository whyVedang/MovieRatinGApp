import express from "express"

import { getFavorite , addFavorite ,removeFavorite} from "../controller/fav.controller.js"
import {protect}  from '../middleware/auth.middleware.js';
import { validate } from "../middleware/validation.middleware.js";
import { favSchema } from "../utils/schema.validator.js";


const router=express.Router()

router.post('/', protect,validate(favSchema), addFavorite );
router.get('/', getFavorite);
router.delete('/:movieId', protect, removeFavorite);

export default router;