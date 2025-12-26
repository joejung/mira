import random
from datetime import datetime, timedelta
from database import SessionLocal, engine
import models, crud, schemas, utils
from sqlalchemy.orm import Session

# Re-create tables
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

CHIPSETS = ['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2', 'Dimensity 9300', 'Dimensity 8300', 'Exynos 2400', 'Bionic A17 Pro', 'Kirin 9000S', 'Tensor G3']
STATUSES = [models.Status.OPEN, models.Status.IN_PROGRESS, models.Status.RESOLVED, models.Status.CLOSED, models.Status.REOPENED]
PRIORITIES = [models.Priority.LOW, models.Priority.MEDIUM, models.Priority.HIGH, models.Priority.CRITICAL]

TITLES = [
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
]

def get_random_item(arr):
    return arr[random.randint(0, len(arr) - 1)]

def get_random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

print("🌱 Seeding 1000 issues (Python)...")

# 1. Create Users
admin = crud.create_user(db, schemas.UserCreate(
    email="admin@mira.com", name="Admin User", password="hashedpassword", role=models.Role.ADMIN
))
dev1 = crud.create_user(db, schemas.UserCreate(
    email="jane@mira.com", name="Jane Doe", password="pw", role=models.Role.DEVELOPER
))
dev2 = crud.create_user(db, schemas.UserCreate(
    email="bob@mira.com", name="Bob Smith", password="pw", role=models.Role.DEVELOPER
))

# 2. Create Project
project = crud.create_project(db, schemas.ProjectCreate(
    name="MIRA Core", key="MIRA", description="Main validated chipset project"
))

assignees = [admin.id, dev1.id, dev2.id, None, None]

# 3. Create Issues
issues_buffer = []
for i in range(1000):
    created_at = get_random_date(datetime.now() - timedelta(days=60), datetime.now())
    status = get_random_item(STATUSES)
    
    resolved_at = created_at
    if status in [models.Status.RESOLVED, models.Status.CLOSED]:
        resolved_at = get_random_date(created_at, datetime.now())

    issue = models.Issue(
        title=f"{get_random_item(TITLES)} [Py-Case {10000 + i}]",
        description="Auto-generated load test issue via Python.",
        status=status,
        priority=get_random_item(PRIORITIES),
        projectId=project.id,
        reporterId=admin.id,
        assigneeId=get_random_item(assignees),
        chipset=get_random_item(CHIPSETS),
        createdAt=created_at,
        updatedAt=resolved_at
    )
    db.add(issue)
    
    if i % 100 == 0:
        db.commit()
        print(f"Created {i} issues...")

db.commit()
db.close()
print("✅ Seeding complete!")
