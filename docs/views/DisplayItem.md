## Display Item View

### Grid Organization
- Items flow **left to right** in rows within each category
- Multiple items can appear on the same row
- Cards are **uniformly sized** for visual consistency
- When items in a category cannot be displayed at once, there will appear a horizontal scrollable bar.

### Shortcuts
- Cmd+N: New item
- Cmd+Edit: Edit the item
- Cmd+space: Review the item
- Cmd+L: Review the item
- Double click: Review the item

### Card States
**Unreviewed Items** (Priority Display):
- Bright white background with blue borders
- Full opacity and visibility
- Clear, readable text
**Reviewed Items** (Secondary Display):
- Dimmed appearance (60% opacity)
- Gray borders and muted colors
- "Reviewed ✓" status indicator

### Card Content Layout
Each card displays:
1. **Item Name** - Bold title (e.g., "Derivatives", "Ephemeral")
2. **Problem Preview** - Shows snippet of the actual problem content
3. **Media Indicators** - Visual buttons for additional content:
    - 📎 "Link" - for URL references
    - 🖼️ "Image" - for visual content
4. **Show Answer Button** - Blue action button to reveal the answer
5. **Date stamp** - shows when it was created/last accessed (e.g., "2024-01-15")
6. **Edit button**
7. **Delete button**

### Content Types Displayed

**Problem Content** (shown on cards):
- **Text**: Displayed as-is (full content)
- **URLs**: Shown as clickable link buttons
- **Images**: Displayed as "show the image" buttons (for data efficiency)

**Answer Content** (hidden until requested):
- Accessed via "Show Answer" button
- Opens in separate interface
- Can contain text, URLs, and/or images

### Sorting Logic

#### Primary Sort: Review Status

1. **Unreviewed items first** - These need immediate attention
2. **Reviewed items second** - Available for reference but deprioritized

#### Secondary Sort: Temporal

Within each review status, items are sorted by:
- Created date or last accessed time
- Most recent items appear last

### Sidebar Information

**Quick Stats panel** provides:
- **Finished** - unreviewed item count/total item count (e.g., 12/20)
