import express from 'express';
import { createRating, getRatings } from '../controllers/rating.controller.js';

const router = express.Router();

// Create a new rating
router.post('/', createRating);

// Get all ratings for a listing
router.get('/:listingID', getRatings);

export default router;