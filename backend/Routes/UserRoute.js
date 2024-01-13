import express from "express";
import { deleteUser, followUser, getUser, UnFollowUser, updateUser,getAllUsers } from "../Controllers/UserController.js";

const router = express.Router();

router.put('/:id', followUser)
router.get('/',getAllUsers)
router.get('/:id', getUser)
router.put('/:id/update', updateUser)
router.delete('/:id', deleteUser)

router.put('/:id/unfollow', UnFollowUser)
export default router;