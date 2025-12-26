import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
    default: {
        issue: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

describe('Issue Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/issues', () => {
        it('should return all issues', async () => {
            const mockIssues = [
                { id: 1, title: 'Issue 1', status: 'OPEN' },
                { id: 2, title: 'Issue 2', status: 'IN_PROGRESS' },
            ];
            (prisma.issue.findMany as any).mockResolvedValue(mockIssues);

            const res = await request(app).get('/api/issues');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockIssues);
        });
    });

    describe('POST /api/issues', () => {
        it('should create a new issue', async () => {
            const newIssue = { 
                title: 'New Issue', 
                projectId: 1, 
                reporterId: 1,
                chipset: 'QUALCOMM',
                chipsetVer: 'SD8 Gen 3'
            };
            (prisma.issue.create as any).mockResolvedValue({ id: 3, ...newIssue });

            const res = await request(app)
                .post('/api/issues')
                .send(newIssue);

            expect(res.status).toBe(201);
            expect(res.body.id).toBe(3);
            expect(res.body.title).toBe('New Issue');
            expect(res.body.chipset).toBe('QUALCOMM');
        });
    });

    describe('GET /api/issues/:id', () => {
        it('should return issue by ID', async () => {
            const mockIssue = { id: 1, title: 'Issue 1' };
            (prisma.issue.findUnique as any).mockResolvedValue(mockIssue);

            const res = await request(app).get('/api/issues/1');

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Issue 1');
        });

        it('should return 404 if issue not found', async () => {
            (prisma.issue.findUnique as any).mockResolvedValue(null);

            const res = await request(app).get('/api/issues/999');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Issue not found');
        });
    });
});
