from typing import List
from pydantic import BaseModel
from enum import Enum


class StudyQualtricsConfig(BaseModel):
    """Configuration model for Qualtrics study"""
    url: str
    secret: str


class StudyBase(BaseModel):
    """Common base study model"""
    title: str
    description: str
    configuration: StudyQualtricsConfig


class StudyPost(StudyBase):
    """Study POST request model"""
    pass


class StudyStatusValues(str, Enum):
    """Study status values"""
    submitted = "SUBMITTED"
    approved = "APPROVED"
    denied = "DENIED"


class StudyStatus(BaseModel):
    """Study status model"""
    status: StudyStatusValues


class StudyCreate(StudyBase, StudyStatus):
    """Study create model"""
    owner: str


class Study(StudyBase, StudyStatus):
    """Study response model"""
    id: int
    owner: str

    class Config:
        orm_mode = True


class UserData(BaseModel):
    """User data obtained from auth token"""
    username: str
    groups: List[str]
    is_admin: bool
    is_researcher: bool
