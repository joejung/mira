from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud, utils, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "MIRA Backend (FastAPI)"}

# --- Auth ---
@app.post("/api/auth/login")
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=user_in.email)
    if not user or not utils.verify_password(user_in.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = utils.create_access_token(data={"sub": user.email})
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

@app.post("/api/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# --- Projects ---
@app.get("/api/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db)
    return projects

@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

# --- Issues ---
@app.get("/api/issues", response_model=List[schemas.Issue])
def read_issues(skip: int = 0, limit: int = 2000, db: Session = Depends(get_db)):
    issues = crud.get_issues(db, skip=skip, limit=limit)
    return issues

@app.post("/api/issues", response_model=schemas.Issue)
def create_issue(issue: schemas.IssueCreate, db: Session = Depends(get_db)):
    return crud.create_issue(db=db, issue=issue)

@app.put("/api/issues/{issue_id}", response_model=schemas.Issue)
def update_issue(issue_id: int, issue: schemas.IssueUpdate, db: Session = Depends(get_db)):
    db_issue = crud.update_issue(db, issue_id=issue_id, updates=issue)
    if db_issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

# --- Comments ---
@app.post("/api/comments", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    return crud.create_comment(db=db, comment=comment)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
