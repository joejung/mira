import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all projects with issue counts
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                _count: {
                    select: { issues: true }
                }
            },
        });
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new project
router.post('/', async (req: Request, res: Response) => {
    const { name, key, description } = req.body;
    try {
        const project = await prisma.project.create({
            data: { name, key, description },
        });
        res.status(201).json(project);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get project details by ID with issues
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: {
                issues: true
            }
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
