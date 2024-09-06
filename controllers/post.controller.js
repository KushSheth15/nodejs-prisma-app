import prisma from "../db/db.config.js";

// Utility function for error handling
const handleError = (res, error, message = 'Internal Server Error') => {
    console.error(error);
    return res.status(500).json({ status: 500, message });
};

export const createPosts = async (req, res) => {
    const { user_id, title, description } = req.body;

    if (!user_id || !title || !description) {
        return res.status(400).json({ message: "User ID, title, and description are required" });
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                user_id: Number(user_id),
                title,
                description
            }
        });

        return res.status(201).json({ status: 201, data: newPost, message: 'Post created successfully' });

    } catch (error) {
        return handleError(res, error, 'Failed to create post');
    }
};

export const fetchPosts = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        // Validating and sanitizing pagination values
        page = page <= 0 ? 1 : page;
        limit = limit <= 0 || limit > 100 ? 10 : limit;

        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            include: {
                Comment: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { id: 'desc' },
        });

        const totalPosts = await prisma.post.count();
        const totalPages = Math.ceil(totalPosts / limit);

        return res.status(200).json({
            status: 200,
            data: posts,
            meta: {
                currentPage: page,
                totalPages,
                limit,
                totalPosts
            }
        });

    } catch (error) {
        return handleError(res, error, 'Failed to fetch posts');
    }
};

export const searchPost = async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                description: {
                    search: query
                }
            }
        });

        return res.status(200).json({ status: 200, data: posts });

    } catch (error) {
        return handleError(res, error, 'Failed to search posts');
    }
};
