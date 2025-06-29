## ImageViewerModal Component

### Overview
The **ImageViewerModal** is a full-screen modal component that provides an optimal image viewing experience throughout the Mnemos Web application. It replaces the previous behavior of opening images in new browser tabs.

### Purpose
- Display multiple images in a single, organized interface
- Provide mobile-friendly image viewing with touch gestures
- Maintain consistent image viewing experience across all app sections
- Support keyboard navigation for accessibility

### Features

#### Visual Design
- **Full-screen modal** with dark semi-transparent overlay (rgba(0, 0, 0, 0.8))
- **Vertical image layout** - all images displayed in a single scrollable column
- **White borders** around images for better contrast and definition
- **Image count indicator** at the top when multiple images are present
- **Modal title** showing context (e.g., "Problem Images", "Answer Images")

#### Interaction Methods
- **ESC key** - Press Escape to close the modal
- **Click outside** - Click the dark overlay to close
- **Swipe gestures** - Swipe up or down on mobile devices to close
- **Close button** - White circular close button (×) in top-right corner

#### Responsive Behavior
- **Mobile optimized** - Touch-friendly interface with swipe gestures
- **Adaptive sizing** - Images scale to fit available screen space
- **Scrollable content** - Vertical scrolling when content exceeds screen height
- **High z-index** (2000) - Appears above other modal components

### Usage Locations

#### ItemCard Component
- **Image Button**: Shows "🖼️ Image" (single) or "🖼️ 3 Images" (multiple)
- **Combines all images** from both problem and answer sections
- **Title**: "{Item Name} - Images"

#### ShowAnswerModal Component
- **Problem Images Section**: Single button showing count
- **Answer Images Section**: Single button showing count  
- **Separate viewers** for problem vs answer images
- **Titles**: "Problem Images" or "Answer Images"

### Technical Implementation

#### Component Structure
```typescript
interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title?: string;
}
```

#### State Management
- **Local React state** for touch gesture tracking
- **Parent component state** for modal visibility and image data
- **Effect hooks** for keyboard event listeners

#### Event Handling
- **Keyboard events**: ESC key detection with cleanup
- **Touch events**: Touch start/end coordinates for swipe detection
- **Mouse events**: Click outside detection for closing
- **Swipe threshold**: 50px minimum distance for gesture recognition

#### Styling Approach
- **Inline styles** following project conventions
- **Consistent color scheme** with app design system
- **Typography**: Arial font family matching app standards
- **Responsive units**: vh/vw for screen-relative sizing

### Image Display Behavior

#### Single Image
- **Button text**: "🖼️ Image"
- **Modal display**: Single image with title and close controls

#### Multiple Images
- **Button text**: "🖼️ X Images" (where X is the count)
- **Modal display**: All images in vertical column with scroll
- **Count indicator**: Shows "X images" at top of modal

#### Image Sizing
- **Max width**: 90vw (90% of viewport width)
- **Max height**: 70vh (70% of viewport height)
- **Object fit**: contain (preserves aspect ratio)
- **Border styling**: 3px solid white with 8px border radius

### Integration Points

#### Backend Image Serving
- **Image URLs**: `http://localhost:8000/images/{uuid}.{ext}`
- **Static file serving** via FastAPI `/images/` route
- **UUID-based filenames** for security and uniqueness

#### Data Structure
- **Array format**: `problemImages: string[]`, `answerImages: string[]`
- **URL paths**: Full URLs including protocol and domain
- **Multiple image support**: Unlimited images per section

### Development Considerations

#### Performance
- **Lazy loading**: Images load on-demand when modal opens
- **Memory management**: Proper cleanup of event listeners
- **Gesture detection**: Optimized touch event handling

#### Accessibility
- **Keyboard navigation**: ESC key support
- **Screen reader support**: Proper alt text on images
- **Focus management**: Modal traps focus appropriately

#### Browser Compatibility
- **Modern browsers**: ES6+ features used
- **Touch devices**: Comprehensive touch event support
- **Responsive design**: Works across all screen sizes

### Migration from Previous Behavior
**Before**: Individual numbered buttons opened images in new browser tabs
**After**: Single button per section opens ImageViewerModal with all images

This change provides:
- Better user experience with consistent in-app viewing
- Mobile-friendly interface with touch gestures
- Reduced browser tab clutter
- Organized display of multiple images in one interface