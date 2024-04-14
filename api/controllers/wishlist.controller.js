import Wishlist from "../models/wishlist.model.js";
import { errorHandler } from "../utils/error.js";

export const createWishlist = async (req, res, next) => {
    try{
        const wishlist = await Wishlist.create(req.body);
        return res.status(201).json(wishlist);
    } catch(error) {
        next(error);
    }
}
export const getWishlists = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.find({ userRef: req.user._id });
    console.log(req.user._id);
    res.status(200).json(wishlists);
  } catch (err) {
    next(err);
  }
};