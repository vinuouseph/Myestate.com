import express from 'express';
import { createComment, getComment, deleteComment } from '../controllers/comment.controller.js';


const router = express.Router();

// Create a new rating
router.post('/', createComment);

// Get all ratings for a listing
router.get('/:listingID', getComment);

// Delete a comment
router.delete('/:commentId', deleteComment);

export default router;