from typing import Union
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
    configuration: Union[StudyQualtricsConfig]


class StudyCreate(StudyBase):
    """Study creation model"""
    pass


class StudyStatusValues(str, Enum):
    """Study status values"""
    submitted = "SUBMITTED"
    approved = "APPROVED"
    denied = "DENIED"


class StudyStatus(BaseModel):
    """Study status model"""
    status: StudyStatusValues


class StudyResponse(StudyBase, StudyStatus):
    """Study response model"""
    id: int
