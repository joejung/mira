import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
    default: {
        project: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

describe('Project Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/projects', () => {
        it('should return all projects', async () => {
            const mockProjects = [
                { id: 1, name: 'Project 1', key: 'P1', _count: { issues: 5 } },
                { id: 2, name: 'Project 2', key: 'P2', _count: { issues: 0 } },
            ];
            (prisma.project.findMany as any).mockResolvedValue(mockProjects);

            const res = await request(app).get('/api/projects');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProjects);
            expect(prisma.project.findMany).toHaveBeenCalled();
        });
    });

    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const newProject = { name: 'New Project', key: 'NP', description: 'Desc' };
            (prisma.project.create as any).mockResolvedValue({ id: 3, ...newProject });

            const res = await request(app)
                .post('/api/projects')
                .send(newProject);

            expect(res.status).toBe(201);
            expect(res.body.id).toBe(3);
            expect(res.body.name).toBe('New Project');
        });
    });

    describe('GET /api/projects/:id', () => {
        it('should return project details by ID', async () => {
            const mockProject = { id: 1, name: 'Project 1', issues: [] };
            (prisma.project.findUnique as any).mockResolvedValue(mockProject);

            const res = await request(app).get('/api/projects/1');

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
        });

        it('should return 404 if project not found', async () => {
            (prisma.project.findUnique as any).mockResolvedValue(null);

            const res = await request(app).get('/api/projects/999');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Project not found');
        });
    });
});
