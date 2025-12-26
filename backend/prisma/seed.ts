
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CHIPSETS = ['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2', 'Dimensity 9300', 'Dimensity 8300', 'Exynos 2400', 'Bionic A17 Pro', 'Kirin 9000S', 'Tensor G3'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED']; 
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TITLES = [
  'Overheating during 5G benchmark',
  'Camera app crashes on video switch',
  'WiFi 6E throughput unstable',
  'Bluetooth latency > 200ms',
  'GPU artifacting in Genshin Impact',
  'Battery drain excessive in standby',
  'NPU inference failure',
  'Display flickering at 120Hz',
  'Kernel panic on boot',
  'Touch sampling rate drop',
  'Audio distortion at max volume',
  'Fingerprint sensor timeout',
  'USB-C charging slow',
  'VoLTE call drop',
  'GPS accuracy drift',
  'Memory leak in launcher',
  'App crash on split screen',
  'Notification delay > 5s',
  'Biometric unlock failure',
  'Screen rotation lag'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Starting 1000 issue seed...');

  // Ensure we have at least one user
  const user = await prisma.user.upsert({
    where: { email: 'admin@mira.com' },
    update: {},
    create: {
      email: 'admin@mira.com',
      name: 'Admin User',
      password: 'hashedpassword', 
      role: 'ADMIN',
    },
  });

  // Ensure developers exist for random assignment
  const dev1 = await prisma.user.upsert({ where: { email: 'jane@mira.com' }, update: {}, create: { email: 'jane@mira.com', name: 'Jane Doe', password: 'pw', role: 'DEVELOPER' } });
  const dev2 = await prisma.user.upsert({ where: { email: 'bob@mira.com' }, update: {}, create: { email: 'bob@mira.com', name: 'Bob Smith', password: 'pw', role: 'DEVELOPER' } });
  const assignees = [user.id, dev1.id, dev2.id, null, null]; 

  const project = await prisma.project.upsert({
    where: { key: 'MIRA' },
    update: {},
    create: {
      name: 'MIRA Core',
      key: 'MIRA',
      description: 'Main validated chipset project',
    },
  });

  const issues = [];
  for (let i = 0; i < 1000; i++) {
    const createdAt = getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date()); // Last 60 days
    
    // Status distribution logic to make it realistic
    let status = getRandomItem(STATUSES);
    let resolvedDate = new Date();
    
    if (status === 'RESOLVED' || status === 'CLOSED') {
        resolvedDate = getRandomDate(createdAt, new Date());
    } else {
        resolvedDate = createdAt; // Just keep it same if open
    }

    issues.push({
      title: `${getRandomItem(TITLES)} [Case ${10000 + i}]`,
      description: 'Auto-generated load test issue.',
      status: status as any,
      priority: getRandomItem(PRIORITIES) as any,
      projectId: project.id,
      reporterId: user.id,
      assigneeId: getRandomItem(assignees),
      chipset: getRandomItem(CHIPSETS),
      createdAt: createdAt,
      updatedAt: resolvedDate
    });
  }

  // SQLite optimization: chunk inserts
  const chunkSize = 50; 
  for (let i = 0; i < issues.length; i += chunkSize) {
    const chunk = issues.slice(i, i + chunkSize);
    await prisma.issue.createMany({
      data: chunk
    });
    // Small delay to prevent lock contention if any
    // await new Promise(r => setTimeout(r, 10));
  }

  console.log('✅ Seeding complete: 1000 issues added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
