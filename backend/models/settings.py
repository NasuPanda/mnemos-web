from pydantic import BaseModel


class Settings(BaseModel):
    confident_days: int
    medium_days: int
    wtf_days: int