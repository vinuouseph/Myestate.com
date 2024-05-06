import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createWishlist , getWishlists} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post('/Wcreate', verifyToken, createWishlist);
router.get('/', verifyToken, getWishlists);


export default router;