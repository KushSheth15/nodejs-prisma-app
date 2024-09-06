import { Router } from 'express';
import userRoute from './user.routes.js';
import postRoute from './post.routes.js';
import commentRoute from './comment.routes.js';

const router = Router();

router.use('/api/user', userRoute);
router.use('/api/post', postRoute);
router.use('/api/comment', commentRoute);

export default router;