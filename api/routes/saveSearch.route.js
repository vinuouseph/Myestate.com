import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createSaveSearch, deleteSearch, getSavedSearches, updateSaveSearch } from "../controllers/saveSearch.controller.js";


const router = express.Router();

router.post('/createSave', verifyToken, createSaveSearch);
router.post('/savedsearch', verifyToken, getSavedSearches);
router.delete('/delete/:id', verifyToken, deleteSearch);
router.put('/update/:id', verifyToken, updateSaveSearch);

export default router;