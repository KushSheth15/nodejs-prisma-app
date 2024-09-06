import prisma from "../db/db.config.js";

// Utility function for error handling
const handleError = (res, error, message = 'Internal Server Error') => {
    console.error(error);  // Log the error for debugging
    return res.status(500).json({ status: 500, message });
};

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await prisma.user.create({
            data: { name, email, password }
        });

        return res.status(201).json({ status: 201, data: newUser, message: 'User created successfully' });

    } catch (error) {
        return handleError(res, error);
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
        return res.status(400).json({ message: "At least one field (name, email, password) is required" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, password }
        });

        return res.status(200).json({ status: 200, data: updatedUser, message: 'User updated successfully' });

    } catch (error) {
        return handleError(res, error, 'Failed to update user');
    }
};

export const fetchUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                post: {
                    select: { title: true, comment_count: true }
                }
            }
        });

        return res.status(200).json({ status: 200, data: users });

    } catch (error) {
        return handleError(res, error, 'Failed to fetch users');
    }
};

export const showUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findFirst({
            where: { id: Number(id) }
        });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, data: user });

    } catch (error) {
        return handleError(res, error, 'Failed to fetch user');
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // await prisma.user.delete({
        //     where: { id: Number(id) }
        // });

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { deleted_at: new Date() }
        });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, message: 'User deleted successfully' });

    } catch (error) {
        return handleError(res, error, 'Failed to delete user');
    }
};
