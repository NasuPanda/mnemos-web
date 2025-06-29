## New/Edit Item View
### Interface
A modal window (640px × 540px) with the following input fields and "Submit" button.

### Fields
- Name (text)
- Category (Preset by default. Can be selected by the category select box.)
- Problem (More on it later)
- Answer (More on it later)
- Side Note (text)

#### Problem
- Fields can include text, url, and/or multiple images. All of them are optional.
- Accept multiple inputs. For instance, the user can input text, image(s), and url. Also, the user can only input one or two field(s).
- Could be none.
- **Multiple Images Support**: Users can upload multiple images per problem
- **Image Upload Methods**: 
  - 📎 "Select Image Files" button - supports multiple file selection
  - 📋 "Paste Image Here" area - supports pasting clipboard images with Ctrl+V/Cmd+V
- **Image Management**: Individual remove buttons (×) for each image, "Clear All" button
- Display:
	- text as-is.
	- url as a clickable link.
	- images as buttons ("🖼️ Image" or "🖼️ 3 Images") that open in **ImageViewerModal**

#### Answer
- Fields can include text, url, and/or multiple images. All of them are optional.
- Accept multiple inputs. For instance, the user can input text, image(s), and url. Also, the user can only input one or two field(s).
- Could be none.
- **Multiple Images Support**: Users can upload multiple images per answer
- **Image Upload Methods**: 
  - 📎 "Select Image Files" button - supports multiple file selection
  - 📋 "Paste Image Here" area - supports pasting clipboard images with Ctrl+V/Cmd+V
- **Image Management**: Individual remove buttons (×) for each image, "Clear All" button
- When the user clicks "Show answer," display text, url, and images in a separated interface.
- Images displayed in separate "Answer Images" section with single button showing count that opens **ImageViewerModal**

### Image Upload Interface
Each image field (Problem Images, Answer Images) contains:

1. **Upload Button Section**:
   - "📎 Select Image Files" button
   - Opens file browser with multiple selection enabled
   - Supports common image formats (JPG, PNG, GIF, WebP, BMP)

2. **Paste Area Section**:
   - "📋 Paste Image Here (Ctrl+V)" dashed border area
   - Accepts clipboard image data
   - Adds pasted images to existing collection

3. **Image Display Section** (when images are uploaded):
   - Shows chips for each uploaded image: "🖼️ Image 1 ×"
   - Individual remove buttons (×) for each image
   - Numbered display for easy identification

4. **Status Section**:
   - Shows current state: "No images selected", "🔄 Uploading...", or "✅ 2 images ready"
   - "Clear All" button when images are present

### Data Structure
Images are stored as arrays in the data:
```json
{
  "problem_images": ["/images/uuid1.jpg", "/images/uuid2.png"],
  "answer_images": ["/images/uuid3.jpg"]
}
```

### File Upload Process
1. File validation (type, size ≤10MB, allowed extensions)
2. UUID-based filename generation for security
3. Storage in `/app/data/images/` directory
4. Path returned as `/images/{uuid}.{ext}`
5. Multiple uploads processed sequentially
6. Paths added to existing image arrays

### ImageViewerModal Component
The **ImageViewerModal** provides a full-screen image viewing experience when users click image buttons throughout the application.

#### Features
- **Full-screen modal** with dark overlay background
- **All images displayed vertically** in one scrollable window
- **ESC key support** - press Escape to close the modal
- **Mobile gesture support** - swipe up or down to close on touch devices
- **Image count indicator** - shows "X images" when multiple images present
- **Responsive design** - adapts to different screen sizes
- **White borders** around images for better visibility

#### Behavior
- **Single button per section** - replaces individual numbered buttons
- **Button labels**: 
  - "🖼️ Image" for single image
  - "🖼️ 3 Images" for multiple images (shows count)
- **Modal title** - shows context like "Problem Images" or "Answer Images"
- **Vertical layout** - all images displayed in one scrollable column
- **Click outside to close** - clicking the dark overlay closes the modal

#### Technical Implementation
- **Component**: `ImageViewerModal.tsx`
- **State management**: Local React state for modal visibility and image data
- **Touch handling**: Custom touch event handlers for swipe gestures
- **Keyboard handling**: ESC key event listener with cleanup
- **Z-index**: High z-index (2000) to appear above other modals
- **Image loading**: Direct image src URLs served by backend