from typing import List, Optional
from pydantic import BaseModel


class Item(BaseModel):
    id: Optional[str] = None
    name: str
    section: str
    side_note: str = ""
    
    problem_text: Optional[str] = None
    problem_url: Optional[str] = None
    problem_image: Optional[str] = None
    
    answer_text: Optional[str] = None
    answer_url: Optional[str] = None
    answer_image: Optional[str] = None
    
    reviewed: bool = False
    next_review_date: Optional[str] = None
    review_dates: List[str] = []
    
    created_date: str
    last_accessed: str
    archived: bool = False