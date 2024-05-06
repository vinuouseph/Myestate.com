import Rating from '../models/rating.model.js';
import Listing from '../models/listing.model.js';

// Create a new rating
export const createRating = async (req, res) => {
  const { listingID, userRef, rating } = req.body;

  try {
  const newRating = new Rating({ listingID, userRef, rating });
  const savedRating = await newRating.save();

  // Update the listing's rating efficiently using Mongoose update operators
  const updatedListing = await Listing.findByIdAndUpdate(
    listingID,
    { $inc: { totalRatings: 1 }, $set: { averageRating: calculateAverageRating(listingID) } },
    { new: true } // Return the updated document
  );

  if (!updatedListing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.status(200).json(savedRating);
} catch (err) {
  console.error(err); // Log the error for better debugging
  res.status(500).json({ error: 'Internal server error' });
}



};

// Function to calculate the average rating
async function calculateAverageRating(listingID) {
  const ratings = await Rating.find({ listingID });
  if (!ratings.length) {
    return 0; // Handle cases with no ratings
  }

  const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRatings / ratings.length;
  return averageRating;
}
// Get all ratings for a listing
// Get all ratings for a listing
export const getRatings = async (req, res) => {
    const { listingID } = req.params;
  
    try {
      const ratings = await Rating.find({ listingID });
      res.status(200).json(ratings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  