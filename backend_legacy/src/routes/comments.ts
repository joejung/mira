import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all comments for an issue
router.get('/issue/:issueId', async (req: Request, res: Response) => {
    const { issueId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { issueId: parseInt(issueId) },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(comments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new comment
router.post('/', async (req: Request, res: Response) => {
    const { content, issueId, authorId } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                issueId,
                authorId
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a comment
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const comment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        res.json(comment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a comment
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.comment.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
