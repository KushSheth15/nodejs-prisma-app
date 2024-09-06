import { Router } from "express";
import {createComments,fetchComments} from '../controllers/comment.controller.js';

const router = Router();

router.post("/create-comment",createComments);
router.get("/get-comment",fetchComments);

export default router;