import express from "express"

import { getFavorite , addFavorite ,removeFavorite} from "../controller/fav.controller.js"
import {tokenVerify}  from '../middleware/auth.middleware.js';


const router=express.Router()

router.post('/:movieId', tokenVerify, addFavorite );
router.get('/', tokenVerify, getFavorite);
router.delete('/:movieId', tokenVerify, removeFavorite);

export default router;