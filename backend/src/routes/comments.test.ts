import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
    default: {
        comment: {
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

describe('Comment Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/comments/issue/:issueId', () => {
        it('should return all comments for an issue', async () => {
            const mockComments = [
                { id: 1, content: 'First comment', author: { id: 1, name: 'Admin', email: 'admin@mira.com' } },
                { id: 2, content: 'Second comment', author: { id: 1, name: 'Admin', email: 'admin@mira.com' } },
            ];
            (prisma.comment.findMany as any).mockResolvedValue(mockComments);

            const res = await request(app).get('/api/comments/issue/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockComments);
            expect(prisma.comment.findMany).toHaveBeenCalledWith({
                where: { issueId: 1 },
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'desc' }
            });
        });
    });

    describe('POST /api/comments', () => {
        it('should create a new comment', async () => {
            const newComment = { content: 'New comment', issueId: 1, authorId: 1 };
            const createdComment = { 
                id: 3, 
                ...newComment, 
                author: { id: 1, name: 'Admin', email: 'admin@mira.com' } 
            };
            (prisma.comment.create as any).mockResolvedValue(createdComment);

            const res = await request(app)
                .post('/api/comments')
                .send(newComment);

            expect(res.status).toBe(201);
            expect(res.body.id).toBe(3);
            expect(res.body.content).toBe('New comment');
        });
    });

    describe('PUT /api/comments/:id', () => {
        it('should update a comment', async () => {
            const updatedComment = { id: 1, content: 'Updated content', author: { id: 1, name: 'Admin' } };
            (prisma.comment.update as any).mockResolvedValue(updatedComment);

            const res = await request(app)
                .put('/api/comments/1')
                .send({ content: 'Updated content' });

            expect(res.status).toBe(200);
            expect(res.body.content).toBe('Updated content');
        });
    });

    describe('DELETE /api/comments/:id', () => {
        it('should delete a comment', async () => {
            (prisma.comment.delete as any).mockResolvedValue({});

            const res = await request(app).delete('/api/comments/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Comment deleted successfully');
        });
    });
});
