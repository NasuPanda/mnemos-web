## Display Item View

### Grid Organization
- Items flow **left to right** in rows within each category
- Multiple items can appear on the same row
- Cards have **consistent width** (140px) but **flexible height** based on content
- Cards have a **minimum height** (120px) and expand vertically as needed
- **Category height** matches the tallest card in that category
- All cards within a category align to the same top baseline
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
- Dimmed appearance (70% opacity)
- Gray borders and muted colors
- "Reviewed ✓" status indicator

### Card Content Layout
Each card displays:
1. **Item Name** - Bold title with automatic text wrapping (e.g., "Derivatives", "Ephemeral")
2. **Problem Content** - Full problem text with automatic word wrapping
3. **Media Indicators** - Visual buttons for additional content (if present):
    - 📎 "Link" - for URL references
    - 🖼️ "Image" or 🖼️ "3 Images" - for visual content (opens **ImageViewerModal**)
4. **Show Answer Button** - Blue action button to reveal the answer
5. **Action Buttons** - Edit and Delete buttons in a horizontal row
6. **Date stamp** - shows when it was created/last accessed (e.g., "06/25/2024")
7. **Review Status** - "✓ Reviewed" indicator for completed items

**Content Behavior:**
- Text automatically wraps within card boundaries
- Cards expand vertically to accommodate longer content
- All content remains contained within card borders
- No text truncation - full content is always visible

### Content Types Displayed

**Problem Content** (shown on cards):
- **Text**: Displayed in full with automatic word wrapping
- **URLs**: Shown as clickable link buttons
- **Images**: Multiple images supported - displayed as "🖼️ Image" or "🖼️ 3 Images" buttons that open **ImageViewerModal**

**Answer Content** (hidden until requested):
- Accessed via "Show Answer" button
- Opens in separate modal interface
- Can contain text, URLs, and/or multiple images
- Images displayed in separate sections with buttons that open **ImageViewerModal**

### Multiple Images Support
- **Problem Images**: Array of image paths, displayed as single button showing count
- **Answer Images**: Array of image paths, displayed as single button showing count
- **Image Count Display**: Shows count when multiple images (e.g., "🖼️ 3 Images")
- **Click Behavior**: Opens **ImageViewerModal** with all images displayed vertically
- **Modal Features**: ESC key support, swipe gestures (mobile), full-screen dark overlay

### Sorting Logic

#### Primary Sort: Review Status

1. **Unreviewed items first** - These need immediate attention
2. **Reviewed items second** - Available for reference but deprioritized

#### Secondary Sort: Temporal

Within each review status, items are sorted by:
- Created date or last accessed time
- Most recent items appear last

### Filtering

Only items displayed are the ones due the date. E.g., if the current display date is "June 29, 2025," then only the items with the `review_date = 2025-06-29` will be displayed.

### Sidebar Information

**Quick Stats panel** provides:
- **Finished** - unreviewed item count/total item count (e.g., 12/20)