import { Router } from "express";
import {createPosts,fetchPosts,searchPost} from '../controllers/post.controller.js';

const router = Router();

router.post("/create-post",createPosts);
router.get("/get-post",fetchPosts);
router.get("/search-post",searchPost);

export default router;