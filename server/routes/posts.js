import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  postInterest,
  postComment,
  getPost,
  updatePost,  
  deletePost    
} from "../controllers/posts.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id", verifyToken, getPost);

router.patch("/:id/interest", verifyToken, postInterest);
router.patch("/:id/comment", verifyToken, postComment);


router.patch("/:id", verifyToken, updatePost);     // Edit post
router.delete("/:id", verifyToken, deletePost);    // Delete post

export default router;
