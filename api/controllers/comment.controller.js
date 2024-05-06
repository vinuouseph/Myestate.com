import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try{
        const comment = await Comment.create(req.body);
        return res.status(201).json(comment);
    } catch(error) {
        next(error);
    }
}
export const getComment = async (req, res, next) => {
    try {
      const { listingID } = req.params;
      console.log('Received listingID:', listingID); // Add this line
  
      // Check if listingID is provided and valid
      if (!listingID || typeof listingID !== 'string') {
        console.log('Invalid or missing listingID'); // Add this line
        return res.status(400).json({ success: false, message: 'Invalid or missing listingID' });
      }
  
      const comments = await Comment.find({ listingID });
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  };

  export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        if (!commentId || typeof commentId !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid or missing commentId' });
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
}