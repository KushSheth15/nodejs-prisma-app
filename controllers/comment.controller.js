import prisma from "../db/db.config.js";

// Utility function for error handling
const handleError = (res, error, message = 'Internal Server Error') => {
    console.error(error);
    return res.status(500).json({ status: 500, message });
};

// Create a comment and update the comment count on the post
export const createComments = async (req, res) => {
    const { user_id, post_id, comment } = req.body;

    // Validate required fields
    if (!user_id || !post_id || !comment) {
        return res.status(400).json({ message: "User ID, Post ID, and comment are required" });
    }

    try {
        // Perform the comment creation and comment count update in a transaction
        const [updatedPost, newComment] = await prisma.$transaction([
            prisma.post.update({
                where: { id: Number(post_id) },
                data: { comment_count: { increment: 1 } }
            }),
            prisma.comment.create({
                data: {
                    user_id: Number(user_id),
                    post_id: Number(post_id),
                    comment
                }
            })
        ]);

        return res.status(201).json({ status: 201, data: newComment, message: 'Comment created successfully' });

    } catch (error) {
        return handleError(res, error, 'Failed to create comment');
    }
};

// Fetch comments with associated post and user data
export const fetchComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                post: {
                    include: { user: true }
                }
            }
        });

        return res.status(200).json({ status: 200, data: comments });

    } catch (error) {
        return handleError(res, error, 'Failed to fetch comments');
    }
};
