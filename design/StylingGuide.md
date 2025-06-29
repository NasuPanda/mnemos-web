# Mnemos App Styling Guide for Generative AI

## Overview
Mnemos is a study-focused spaced repetition app with a calming navy color theme designed to promote concentration and reduce eye strain during long study sessions. The interface emphasizes clarity, professionalism, and visual hierarchy to support effective learning.

This styling guide ensures consistency, maintainability, and a professional appearance while supporting the calming, study-focused aesthetic of the Mnemos application.

## Color Palette

### Primary Colors
```css
:root {
  --primary-navy: #1e3a5f;      /* Deep navy - titles, primary text */
  --accent-navy: #2d5a87;       /* Medium navy - buttons, secondary text */
  --light-blue: #4a90b8;        /* Soft blue - borders, accents */
  --background-blue: #e8f0f5;   /* Light blue-gray - backgrounds, inputs */
  --warm-accent: #f5c842;       /* Golden yellow - edit buttons, highlights */
  --dark-navy: #1a2e42;         /* Darker navy - delete buttons, secondary actions */
  --white: #ffffff;             /* Pure white - card backgrounds, modal content */
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

### Font Stack
```css
font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes & Weights
```css
/* Headers */
.app-title { font-size: 18px; font-weight: bold; color: var(--primary-navy); }
.category-header { font-size: 16px; font-weight: bold; color: var(--primary-navy); }
.modal-title { font-size: 18px; font-weight: bold; color: var(--primary-navy); }
.section-title { font-size: 14px; font-weight: bold; color: var(--primary-navy); }

/* Body Text */
.item-title { font-size: 10-11px; font-weight: bold; color: var(--primary-navy); }
.body-text { font-size: 12px; font-weight: normal; color: var(--accent-navy); }
.secondary-text { font-size: 10-11px; font-weight: normal; color: var(--accent-navy); }
.helper-text { font-size: 11px; font-weight: normal; color: var(--accent-navy); }

/* Small Text */
.timestamp { font-size: 7-8px; font-weight: normal; color: var(--light-blue); }
.button-text { font-size: 8-12px; font-weight: normal; }
.micro-text { font-size: 6-7px; font-weight: normal; }
```

## Layout & Spacing

### Grid System
```css
.main-container {
  padding: 20px;
  background-color: var(--background-blue);
  min-height: 100vh;
}

.category-section {
  margin-bottom: 30px;
}

.item-grid {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}
```

### Card Dimensions
```css
.item-card {
  width: 110px;
  min-height: 100px; /* Flexible height - expands based on content */
  flex-shrink: 0;
  border-radius: 6px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

.card-title {
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.card-content {
  margin-bottom: 8px;
  flex-grow: 1;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.card-buttons {
  margin-top: auto;
  display: flex;
  gap: 5px;
}

/* Category Grid Layout */
.category-grid {
  display: flex;
  align-items: flex-start; /* Align cards to same baseline */
  gap: 10px;
  min-height: fit-content; /* Category height matches tallest card */
}
```

### Modal Dimensions
```css
.review-modal {
  width: 400px;
  height: 300px;
  border-radius: 12px;
}

.edit-modal {
  width: 640px;
  height: 540px;
  border-radius: 12px;
}
```

## Component Styles

### Header Component
```css
.app-header {
  background-color: var(--white);
  border: 2px solid var(--light-blue);
  border-radius: 8px;
  height: 60px;
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-section {
  margin-bottom: 10px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 10px;
}
```

### Item Cards
```css
/* Unreviewed Items */
.item-card--unreviewed {
  background-color: var(--white);
  border: 2px solid var(--accent-navy);
  opacity: 1;
}

/* Reviewed Items */
.item-card--reviewed {
  background-color: var(--background-blue);
  border: 1px solid var(--light-blue);
  opacity: 0.7;
}

.item-card--reviewed * {
  opacity: 0.8;
}
```

### Buttons
```css
/* Primary Action Buttons */
.btn-primary {
  background-color: var(--accent-navy);
  border: 1px solid var(--accent-navy);
  color: var(--white);
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

/* Secondary Buttons */
.btn-secondary {
  background-color: var(--background-blue);
  border: 1px solid var(--light-blue);
  color: var(--accent-navy);
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

/* Edit Buttons */
.btn-edit {
  background-color: var(--warm-accent);
  border: 1px solid var(--warm-accent);
  color: var(--primary-navy);
  border-radius: 2px;
  padding: 3px 8px;
  font-size: 7px;
  cursor: pointer;
}

/* Delete Buttons */
.btn-delete {
  background-color: var(--dark-navy);
  border: 1px solid var(--dark-navy);
  color: var(--white);
  border-radius: 2px;
  padding: 3px 8px;
  font-size: 7px;
  cursor: pointer;
}

/* Navigation Arrows */
.btn-nav {
  background-color: var(--light-blue);
  border: 1px solid var(--light-blue);
  color: var(--white);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}
```

### Form Elements
```css
.form-input {
  background-color: var(--background-blue);
  border: 1px solid var(--light-blue);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--accent-navy);
  width: 100%;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--accent-navy);
  opacity: 0.7;
}

.form-label {
  font-size: 14px;
  font-weight: bold;
  color: var(--primary-navy);
  margin-bottom: 5px;
  display: block;
}

.form-helper {
  font-size: 11px;
  color: var(--accent-navy);
  margin-bottom: 10px;
}
```

### Modals
```css
.modal-overlay {
  background-color: rgba(30, 58, 95, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  border: 3px solid var(--light-blue);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: var(--background-blue);
  border: 1px solid var(--light-blue);
  border-radius: 4px;
  padding: 4px 8px;
  color: var(--accent-navy);
  cursor: pointer;
  font-size: 12px;
}
```

## Scrollbars
```css
.horizontal-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
}

.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background-color: var(--background-blue);
  border: 1px solid var(--light-blue);
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--accent-navy);
  border-radius: 4px;
}
```

## States & Interactions

### Hover States
```css
.btn-primary:hover { background-color: #245073; }
.btn-secondary:hover { background-color: #d1e3f0; }
.btn-edit:hover { background-color: #f7d666; }
.btn-delete:hover { background-color: #0f1a2a; }
.btn-nav:hover { background-color: #3a7a9d; }
```

### Focus States
```css
.form-input:focus {
  outline: none;
  border-color: var(--accent-navy);
  box-shadow: 0 0 0 2px rgba(45, 90, 135, 0.2);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 90, 135, 0.3);
}
```

### Review Status Indicators
```css
.reviewed-indicator {
  font-size: 8px;
  color: var(--accent-navy);
  opacity: 0.8;
}

.reviewed-indicator::before {
  content: "✓ ";
}
```

## Best Practices

### CSS Organization
1. **Use external CSS files** - Never use inline styles except for dynamic values
2. **CSS Variables** - Always use CSS custom properties for colors and common values
3. **BEM Methodology** - Use Block Element Modifier naming convention
4. **Mobile-first** - Design for mobile, enhance for desktop
5. **Semantic HTML** - Use proper HTML5 semantic elements

### File Structure
```
styles/
├── variables.css          /* CSS custom properties */
├── base.css              /* Reset, typography, global styles */
├── components/
│   ├── header.css        /* Header component styles */
│   ├── cards.css         /* Item card styles */
│   ├── buttons.css       /* Button variants */
│   ├── forms.css         /* Form elements */
│   └── modals.css        /* Modal components */
├── layouts/
│   ├── grid.css          /* Grid layouts */
│   └── spacing.css       /* Margin, padding utilities */
└── main.css              /* Import all other files */
```

### Implementation Notes
1. **Consistency**: Always use the defined color variables, never hardcode colors
2. **Accessibility**: Maintain 4.5:1 contrast ratio minimum for text
3. **Responsiveness**: Test on mobile devices (minimum 320px width)
4. **Performance**: Use `will-change` sparingly, prefer `transform` for animations
5. **Browser Support**: Support modern browsers (Chrome 80+, Firefox 75+, Safari 13+)

### Spacing Scale
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 20px;
  --space-xl: 30px;
}
```

### Border Radius Scale
```css
:root {
  --radius-sm: 2px;    /* Small buttons */
  --radius-md: 4px;    /* Standard buttons, inputs */
  --radius-lg: 6px;    /* Cards */
  --radius-xl: 8px;    /* Header */
  --radius-xxl: 12px;  /* Modals */
}
```
