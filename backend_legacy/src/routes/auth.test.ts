import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
        compare: vi.fn(),
    },
}));

describe('Auth Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            (prisma.user.findUnique as any).mockResolvedValue(null);
            (prisma.user.create as any).mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                password: 'hashed_password'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('test@example.com');
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'hashed_password',
                    name: 'Test User'
                }
            });
        });

        it('should return 400 if user already exists', async () => {
            (prisma.user.findUnique as any).mockResolvedValue({ id: '1', email: 'existing@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashed_password',
                name: 'Test User',
                role: 'USER'
            };
            (prisma.user.findUnique as any).mockResolvedValue(mockUser);
            (bcrypt.compare as any).mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('test@example.com');
        });

        it('should return 400 for invalid email', async () => {
            (prisma.user.findUnique as any).mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should return 400 for incorrect password', async () => {
            (prisma.user.findUnique as any).mockResolvedValue({ id: '1', password: 'hashed' });
            (bcrypt.compare as any).mockResolvedValue(false);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrong_password',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
});
