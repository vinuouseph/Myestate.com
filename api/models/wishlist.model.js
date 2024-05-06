import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    userRef:{
        type:String,
        required: true,
    },
    listingID:{
        type:String,
        required: true,
    },
}, {timestamps: true}
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;