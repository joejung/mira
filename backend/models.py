from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SqEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class Role(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    DEVELOPER = "DEVELOPER"

class Status(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"

class Priority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String, nullable=True)
    role = Column(SqEnum(Role), default=Role.USER)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reports = relationship("Issue", back_populates="reporter", foreign_keys="[Issue.reporterId]")
    assigned_issues = relationship("Issue", back_populates="assignee", foreign_keys="[Issue.assigneeId]")
    comments = relationship("Comment", back_populates="author")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    key = Column(String, unique=True, index=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    issues = relationship("Issue", back_populates="project")

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    status = Column(SqEnum(Status), default=Status.OPEN)
    priority = Column(SqEnum(Priority), default=Status.OPEN)
    
    projectId = Column(Integer, ForeignKey("projects.id"))
    reporterId = Column(Integer, ForeignKey("users.id"))
    assigneeId = Column(Integer, ForeignKey("users.id"), nullable=True)

    chipset = Column(String, nullable=True)
    chipsetVer = Column(String, nullable=True)

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="issues")
    reporter = relationship("User", back_populates="reports", foreign_keys=[reporterId])
    assignee = relationship("User", back_populates="assigned_issues", foreign_keys=[assigneeId])
    comments = relationship("Comment", back_populates="issue")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    
    issueId = Column(Integer, ForeignKey("issues.id"))
    authorId = Column(Integer, ForeignKey("users.id"))

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    issue = relationship("Issue", back_populates="comments")
    author = relationship("User", back_populates="comments")
