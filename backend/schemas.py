from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    DEVELOPER = "DEVELOPER"

class Status(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"

class Priority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# User Schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    role: Role = Role.USER

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    key: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    issueId: int
    authorId: int

class Comment(CommentBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    author: User

    class Config:
        from_attributes = True

# Issue Schemas
class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Status = Status.OPEN
    priority: Priority = Priority.MEDIUM
    chipset: Optional[str] = None
    chipsetVer: Optional[str] = None

class IssueCreate(IssueBase):
    projectId: int
    reporterId: int
    assigneeId: Optional[int] = None

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    assigneeId: Optional[int] = None
    chipset: Optional[str] = None

class Issue(IssueBase):
    id: int
    projectId: int
    reporterId: int
    assigneeId: Optional[int] = None
    createdAt: datetime
    updatedAt: datetime
    
    project: Project
    reporter: User
    assignee: Optional[User] = None
    comments: List[Comment] = []

    class Config:
        from_attributes = True
