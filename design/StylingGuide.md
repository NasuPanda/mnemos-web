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

## Responsive Design System

### Breakpoint System (Mobile-First)
```javascript
const breakpoints = {
  mobile: '0px',        // 320px-767px (phones)
  tablet: '768px',      // 768px-1023px (tablets) 
  desktop: '1024px',    // 1024px+ (desktops)
  wide: '1440px'        // 1440px+ (large screens)
}

// Tailwind responsive prefixes
// sm: 640px+, md: 768px+, lg: 1024px+, xl: 1280px+, 2xl: 1536px+
```

### Responsive Card Dimensions
```javascript
const responsiveCardStyles = {
  // Mobile: Single column, full-width cards
  mobile: {
    width: '100%',
    minWidth: '280px',
    maxWidth: '400px',
    margin: '0 auto 15px auto'
  },
  
  // Tablet: 2-3 cards per row with flexible sizing  
  tablet: {
    width: 'calc(50% - 10px)',
    minWidth: '200px',
    maxWidth: '300px'
  },
  
  // Desktop: Current horizontal scroll + responsive width
  desktop: {
    width: '140px',           // Current implementation
    minHeight: '120px',
    flexShrink: 0
  },
  
  // Wide: More cards visible, optimized spacing
  wide: {
    width: '160px',
    minHeight: '120px',
    flexShrink: 0
  }
}
```

### Responsive Typography Scale
```javascript
const responsiveTypography = {
  // App Title
  appTitle: {
    mobile: { fontSize: '20px', lineHeight: '1.2' },
    tablet: { fontSize: '22px', lineHeight: '1.2' },
    desktop: { fontSize: '24px', lineHeight: '1.2' },  // Current
    wide: { fontSize: '26px', lineHeight: '1.2' }
  },
  
  // Card Title
  cardTitle: {
    mobile: { fontSize: '14px', lineHeight: '1.3' },
    tablet: { fontSize: '13px', lineHeight: '1.3' },
    desktop: { fontSize: '12px', lineHeight: '1.3' },  // Current
    wide: { fontSize: '12px', lineHeight: '1.3' }
  },
  
  // Body Text
  bodyText: {
    mobile: { fontSize: '14px', lineHeight: '1.4' },
    tablet: { fontSize: '13px', lineHeight: '1.4' },
    desktop: { fontSize: '12px', lineHeight: '1.4' },  // Current
    wide: { fontSize: '12px', lineHeight: '1.4' }
  }
}
```

### Responsive Modal Dimensions
```javascript
const responsiveModalStyles = {
  // Mobile: Full-screen modals
  mobile: {
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
    padding: '20px'
  },
  
  // Tablet: Large centered modals
  tablet: {
    width: '90vw',
    maxWidth: '600px',
    maxHeight: '80vh',
    borderRadius: '12px'
  },
  
  // Desktop: Current implementation
  desktop: {
    reviewModal: { width: '400px', height: '300px' },
    editModal: { width: '640px', height: '540px' },
    settingsModal: { width: '450px', maxHeight: '80vh' }
  }
}
```

### Touch Interaction Guidelines
```javascript
const touchTargets = {
  // Minimum touch target sizes (accessibility compliance)
  minTouchSize: {
    ios: '44px',        // iOS Human Interface Guidelines
    android: '48px',    // Material Design Guidelines
    recommended: '48px' // Use Android standard for consistency
  },
  
  // Button sizing for different devices
  buttonSizes: {
    mobile: {
      primary: { padding: '12px 20px', fontSize: '16px' },
      secondary: { padding: '10px 16px', fontSize: '14px' },
      small: { padding: '8px 12px', fontSize: '14px' }
    },
    desktop: {
      primary: { padding: '6px 12px', fontSize: '12px' },    // Current
      secondary: { padding: '6px 12px', fontSize: '12px' },  // Current
      small: { padding: '3px 8px', fontSize: '11px' }        // Current
    }
  }
}
```

### Responsive Grid System
```javascript
const responsiveLayouts = {
  // Item Grid Behavior
  itemGrid: {
    mobile: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '15px',
      padding: '15px'
    },
    tablet: {
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      padding: '20px'
    },
    desktop: {
      display: 'flex',           // Current horizontal scroll
      gap: '10px',
      overflowX: 'auto',
      padding: '10px 0'
    }
  },
  
  // Header Layout
  header: {
    mobile: {
      flexDirection: 'column',
      height: 'auto',
      padding: '15px',
      gap: '15px'
    },
    tablet: {
      flexDirection: 'row',
      height: '70px',
      justifyContent: 'space-between'
    },
    desktop: {
      // Current implementation
      height: '70px',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }
}
```

## Implementation Notes

### Current Architecture
- **Inline React Styles**: All styling defined within component files
- **Style Objects**: Consistent style objects for reusability
- **Event-based Interactions**: Hover states via onMouseOver/onMouseOut
- **Tailwind Integration**: Utility classes available for responsive enhancements
- **Responsive Strategy**: Progressive enhancement from mobile-first base

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