import mongoose from "mongoose";

const ratingSchema=new mongoose.Schema({
    listingID:{
        type: String,
        required: true
    },
    userRef:{
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    }
},{timestamps:true}
);

const Rating=mongoose.model('Rating',ratingSchema);

export default Rating;