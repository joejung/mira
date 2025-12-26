import { PrismaClient } from '@prisma/client';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const project = await prisma.project.upsert({
        where: { key: 'MIRA' },
        update: {},
        create: {
            name: 'Mira Flagship',
            key: 'MIRA',
            description: 'The main flagship communication chipset project.',
        },
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@mira.com' },
        update: {},
        create: {
            email: 'admin@mira.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log({ project, user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
