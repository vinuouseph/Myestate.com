import express from "express";
import { deleteUser, getUser, getUserByRef, getUserListings, getUserSaveSearches, test, updateUser, } from '../controllers/user.controller.js';
import { verifyToken } from "../utils/verifyUser.js";



const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/savesearches/:id', verifyToken, getUserSaveSearches);
router.get('/:id', verifyToken, getUser);
router.get("/:userRef", getUserByRef);

export default router;