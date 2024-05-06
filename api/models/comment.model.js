import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    listingID:{
        type: String,
        required: true
    },
    userRef:{
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
},{timestamps:true}
);

const Comment=mongoose.model('Comment',commentSchema);

export default Comment;