# Mnemos App Styling Guide for Generative AI

## Overview
Mnemos is a study-focused spaced repetition app with a calming navy color theme designed to promote concentration and reduce eye strain during long study sessions. The interface emphasizes clarity, professionalism, and visual hierarchy to support effective learning.

This styling guide documents the current inline React styling approach used throughout the application, ensuring consistency and maintainability while supporting the calming, study-focused aesthetic.

## Color Palette

### Primary Colors (Used in Inline Styles)
```javascript
// Primary Colors - Use these exact values in inline styles
const colors = {
  primaryNavy: '#1e3a5f',      // Deep navy - titles, primary text
  accentNavy: '#2d5a87',       // Medium navy - buttons, secondary text
  lightBlue: '#4a90b8',        // Soft blue - borders, accents
  backgroundBlue: '#e8f0f5',   // Light blue-gray - backgrounds, inputs
  warmAccent: '#f5c842',       // Golden yellow - edit buttons, highlights
  darkNavy: '#1a2e42',         // Darker navy - delete buttons, secondary actions
  white: '#ffffff'             // Pure white - card backgrounds, modal content
}
```

### Usage Guidelines
- **Primary Navy (#1e3a5f)**: App titles, main headers, important text
- **Accent Navy (#2d5a87)**: Primary action buttons, body text, navigation elements
- **Light Blue (#4a90b8)**: Borders, secondary buttons, navigation arrows
- **Background Blue (#e8f0f5)**: Page backgrounds, input field backgrounds, light surfaces
- **Warm Accent (#f5c842)**: Edit buttons, positive highlights (use sparingly)
- **Dark Navy (#1a2e42)**: Delete buttons, destructive actions, archive functions
- **White (#ffffff)**: Card backgrounds, modal content areas, text on dark backgrounds

## Typography

### Font Stack (Inline Style)
```javascript
fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
```

### Font Sizes & Weights (Current Implementation)
```javascript
// Headers
const headerStyles = {
  appTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1e3a5f' },
  categoryHeader: { fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f' },
  modalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f' },
  sectionTitle: { fontSize: '14px', fontWeight: 'bold', color: '#1e3a5f' }
}

// Body Text
const textStyles = {
  itemTitle: { fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f' },
  bodyText: { fontSize: '12px', fontWeight: 'normal', color: '#2d5a87' },
  helperText: { fontSize: '11px', fontWeight: 'normal', color: '#2d5a87' }
}

// Small Text
const smallTextStyles = {
  timestamp: { fontSize: '10px', fontWeight: 'normal', color: '#4a90b8' },
  buttonText: { fontSize: '11-12px', fontWeight: 'normal' },
  microText: { fontSize: '10px', fontWeight: 'normal' }
}
```

## Layout & Spacing

### Grid System (Inline Styles)
```javascript
const layoutStyles = {
  mainContainer: {
    padding: '20px',
    backgroundColor: '#e8f0f5',
    minHeight: '100vh'
  },
  
  categorySection: {
    marginBottom: '30px'
  },
  
  itemGrid: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '10px 0'
  }
}
```

### Card Dimensions (Current Implementation)
```javascript
const cardStyles = {
  itemCard: {
    width: '140px',              // Updated from 110px
    minHeight: '120px',          // Flexible height - expands based on content
    flexShrink: 0,
    borderRadius: '6px',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    wordWrap: 'break-word',
    display: 'flex',
    flexDirection: 'column'
  },

  cardTitle: {
    overflow: 'hidden',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  },

  cardContent: {
    marginBottom: '8px',
    flexGrow: 1,
    overflow: 'hidden',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  },

  cardButtons: {
    marginTop: 'auto',
    display: 'flex',
    gap: '5px'
  }
}
```

### Modal Dimensions (Current Implementation)
```javascript
const modalStyles = {
  reviewModal: {
    width: '400px',
    height: '300px',
    borderRadius: '12px'
  },
  
  editModal: {
    width: '640px',
    height: '540px',
    borderRadius: '12px'
  }
}
```

## Component Styles

### Header Component (Inline Styles)
```javascript
const headerStyles = {
  container: {
    backgroundColor: '#ffffff',
    border: '2px solid #4a90b8',
    borderRadius: '8px',
    height: '60px',
    padding: '0 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  titleSection: {
    marginBottom: '10px'
  },

  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },

  dateNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
}
```

### Item Cards (Inline Styles)
```javascript
// Unreviewed Items
const unreviewed = {
  backgroundColor: '#ffffff',
  border: '2px solid #2d5a87',
  opacity: 1
}

// Reviewed Items  
const reviewed = {
  backgroundColor: '#e8f0f5',
  border: '1px solid #4a90b8',
  opacity: 0.7
}
```

### Buttons (Inline Styles)
```javascript
const buttonStyles = {
  // Primary Action Buttons
  primary: {
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Secondary Buttons
  secondary: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    color: '#2d5a87',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Edit Buttons
  edit: {
    backgroundColor: '#f5c842',
    border: '1px solid #f5c842',
    color: '#1e3a5f',
    borderRadius: '2px',
    padding: '3px 8px',
    fontSize: '11px',
    cursor: 'pointer'
  },

  // Delete Buttons
  delete: {
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '2px',
    padding: '3px 8px',
    fontSize: '11px',
    cursor: 'pointer'
  }
}
```

### Form Elements (Inline Styles)
```javascript
const formStyles = {
  input: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2d5a87',
    width: '100%',
    boxSizing: 'border-box'
  },

  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '5px',
    display: 'block'
  },

  helper: {
    fontSize: '11px',
    color: '#2d5a87',
    marginBottom: '10px'
  }
}
```

### Modals (Inline Styles)
```javascript
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(30, 58, 95, 0.4)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },

  content: {
    backgroundColor: '#ffffff',
    border: '3px solid #4a90b8',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto'
  },

  close: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#2d5a87',
    cursor: 'pointer',
    fontSize: '12px'
  }
}
```

## Image Upload Interface Styles

### Multiple Image Upload Components
```javascript
const imageUploadStyles = {
  // Upload button
  uploadButton: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '10px 15px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Paste area
  pasteArea: {
    border: '2px dashed #4a90b8',
    backgroundColor: '#f8fcff',
    borderRadius: '4px',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'text'
  },

  // Image chips
  imageChip: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '3px',
    padding: '3px 6px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center'
  },

  // Status display
  status: {
    backgroundColor: '#f5f9fc',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '11px',
    color: '#2d5a87'
  }
}
```

## States & Interactions

### Hover States (Implemented in Components)
```javascript
// Applied via onMouseOver/onMouseOut events
const hoverStates = {
  primaryButton: { backgroundColor: '#245073' },
  secondaryButton: { backgroundColor: '#d1e3f0' },
  editButton: { backgroundColor: '#f7d666' },
  deleteButton: { backgroundColor: '#0f1a2a' },
  navButton: { backgroundColor: '#3a7a9d' }
}
```

## Implementation Notes

### Current Architecture
- **Inline React Styles**: All styling defined within component files
- **Style Objects**: Consistent style objects for reusability
- **Event-based Interactions**: Hover states via onMouseOver/onMouseOut
- **Responsive Values**: Fixed pixel values optimized for the target use case

### Consistency Guidelines
1. **Color Usage**: Always use the exact hex values from the color palette
2. **Typography**: Maintain consistent font sizes and weights across components
3. **Spacing**: Use consistent gap and padding values (5px, 8px, 10px, 15px, 20px)
4. **Border Radius**: Standard values (2px, 4px, 6px, 8px, 12px)
5. **Component Patterns**: Follow established patterns for buttons, inputs, and modals

### Multiple Images Support
- **Arrays**: Store image paths as arrays in data structure
- **Upload Interface**: Separate upload and paste areas
- **Management**: Individual remove buttons and clear all functionality
- **Display**: Numbered image buttons with count indicators
- **File Validation**: Type, size, and extension checking

### Best Practices
1. **Maintainability**: Keep related styles together in style objects
2. **Reusability**: Extract common style patterns into shared objects
3. **Readability**: Use descriptive names for style objects
4. **Performance**: Avoid creating new style objects in render methods
5. **Accessibility**: Maintain proper contrast ratios and focus states