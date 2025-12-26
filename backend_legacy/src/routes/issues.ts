import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all issues
router.get('/', async (req: Request, res: Response) => {
    try {
        const issues = await prisma.issue.findMany({
            include: {
                project: true,
                reporter: true,
                assignee: true,
            },
        });
        res.json(issues);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new issue
router.post('/', async (req: Request, res: Response) => {
    const { title, description, status, priority, projectId, reporterId, assigneeId, chipset, chipsetVer } = req.body;
    try {
        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                status,
                priority,
                projectId,
                reporterId,
                assigneeId,
                chipset,
                chipsetVer,
            },
        });
        res.status(201).json(issue);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get issue by ID
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const issue = await prisma.issue.findUnique({
            where: { id: parseInt(id) },
            include: {
                project: true,
                reporter: true,
                assignee: true,
            },
        });
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.json(issue);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update issue status
router.patch('/:id/status', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const issue = await prisma.issue.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.json(issue);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
