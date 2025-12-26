from sqlalchemy.orm import Session
import models, schemas, utils

# User
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = utils.get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        password=hashed_password, 
        name=user.name, 
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Project
def get_projects(db: Session):
    return db.query(models.Project).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Issue
def get_issues(db: Session, skip: int = 0, limit: int = 1000):
    return db.query(models.Issue).offset(skip).limit(limit).all()

def create_issue(db: Session, issue: schemas.IssueCreate):
    db_issue = models.Issue(**issue.dict())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def update_issue(db: Session, issue_id: int, updates: schemas.IssueUpdate):
    db_issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not db_issue:
        return None
    
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_issue, key, value)
    
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

# Comment
def create_comment(db: Session, comment: schemas.CommentCreate):
    db_comment = models.Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
