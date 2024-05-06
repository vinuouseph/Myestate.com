import SaveSearch from "../models/saveSearch.model.js";
import { errorHandler } from "../utils/error.js";

export const createSaveSearch = async (req, res, next) => {
    try{
        const saveSearch = await SaveSearch.create(req.body);
        return res.status(201).json(saveSearch);
    } catch(error) {
        next(error);
    }
}

export const getSavedSearches = async (req, res, next) => {
  try {
    const { address, furnished, parking, type, offer } = req.body;
    
    // Split the address into substrings
    const substrings = generateSubstrings(address);
    console.log(substrings);

    // Create an array of queries for each substring
    const queries = substrings.map((substring) => ({
      address: { $regex: substring, $options: 'i' },
      furnished,
      parking,
      type: type === "sale" || type === "rent" ? { $in: [type, "all"] } : type,
      offer,
    }));

    // Find saved searches that match any of the queries
    const savedSearches = await SaveSearch.find({
      $or: queries,
    });

    console.log(savedSearches);
    res.status(200).json(savedSearches);
  } catch (error) {
    next(error);
  }
};

export const updateSaveSearch = async (req, res, next) => {
  try {
      const updatedSaveSearch = await SaveSearch.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
      );
      res.status(200).json({ success: true, message: 'Save search updated successfully', data: updatedSaveSearch });
  } catch (error) {
      next(error);
  }
}

export const deleteSearch = async (req, res, next) => {
  const saveSearch = await SaveSearch.findById(req.params.id);

  if(!saveSearch) {
      return next(errorHandler(404, 'Saved Search not found'));
  }

  if(req.user.id !== saveSearch.userRef) {
      return next(errorHandler(401, 'You can only delete your own saved searches.'));
  }

  try{
      await SaveSearch.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted the Saved Search');
  } catch(error) {
      next(error);
  }
}


function generateSubstrings(str) {
  const substrings = [];

  // Generate substrings for the entire string
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 2; j <= str.length; j++) {
      substrings.push(str.slice(i, j));
    }
  }

  return substrings;
  
}


  

 
