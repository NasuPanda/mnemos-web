from typing import List
from pydantic import BaseModel
from .item import Item
from .settings import Settings


class AppData(BaseModel):
    items: List[Item] = []
    categories: List[str] = []
    settings: Settings = Settings(
        confident_days=7,
        medium_days=3,
        wtf_days=1
    )
    last_updated: str