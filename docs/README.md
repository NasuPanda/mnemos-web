# UI
Main interface structure
- Header + grid-based layout of items, grouped by categories.
- Each review item belongs to a category.
- It has three views: Display Item, Review Item, and New/Edit Item.

# Logic
## Item

Rough sketch:
```python
from datetime import datetime
from typing import Optional, List
from enum import Enum

class Item:
    def __init__(self):
        # Basic Information
        self.name: str = ""
        self.section: str = ""  # Category like "Calculus 1", "Vocabulary"
        self.side_note: str = ""

        # Problem Content (all optional)
        self.problem: Optional[str] = None  # Main problem text
        self.problem_url: Optional[str] = None
        self.problem_images: Optional[List[str]] = []  # Array of file paths

        # Answer Content (all optional)
        self.answer: Optional[str] = None  # Main answer text
        self.answer_url: Optional[str] = None
        self.answer_images: Optional[List[str]] = []  # Array of file paths

        # Review System
        self.reviewed: bool = False  # T/F for reviewed status
        self.next_review_date: Optional[datetime] = None
        self.review_dates: Optional[datetime] = []

        # Metadata
        self.created_date: datetime = datetime.now()
        self.last_accessed: datetime = datetime.now()
        self.archived: bool = False

        # ID for database/tracking
        self.id: Optional[str] = None

    def has_problem_content(self) -> bool:
        """Check if item has any problem content"""
        return any([self.problem, self.problem_url, self.problem_images])

    def has_answer_content(self) -> bool:
        """Check if item has any answer content"""
        return any([self.answer, self.answer_url, self.answer_images])

# ...
```

## Data Storage

**Architecture**: Single JSON file storage
- All application data stored in one JSON file
- Local filesystem for image storage with UUID-based filenames
- Simple backup and portability
- No database setup required

### JSON Data Structure
```json
{
  "items": [
    {
      "id": "uuid-string",
      "name": "Item Name",
      "section": "Category Name",
      "side_note": "Optional notes",

      "problem": "Problem description text",
      "problem_url": "https://example.com",
      "problem_images": ["path/to/image1.jpg", "path/to/image2.png"],

      "answer": "Answer content text",
      "answer_url": "https://answer.com",
      "answer_images": ["path/to/answer1.jpg", "path/to/answer2.jpg"],

      "reviewed": false,
      "next_review_date": "2025-07-06T10:30:00Z",
      "review_dates": ["2025-06-29T10:30:00Z"],

      "created_date": "2025-06-29T10:30:00Z",
      "last_accessed": "2025-06-29T10:30:00Z",
      "archived": false
    }
  ],
  "categories": ["Calculus 1", "Vocabulary", "History"],
  "settings": {
    "confident_days": 7,
    "medium_days": 3,
    "wtf_days": 1
  },
  "last_updated": "2025-06-29T10:30:00Z"
}
```