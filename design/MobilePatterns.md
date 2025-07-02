# Mobile Interaction Patterns

## Overview
This document defines mobile-specific interaction patterns and UI behaviors for the Mnemos app. These patterns ensure optimal usability on touch devices while maintaining the app's core study-focused design principles.

## Touch Interaction Fundamentals

### Touch Target Guidelines
```javascript
const touchTargets = {
  // Minimum sizes (accessibility compliance)
  minimum: {
    ios: '44px',      // iOS Human Interface Guidelines
    android: '48px',  // Material Design Guidelines
    web: '44px'       // WCAG 2.1 AAA compliance
  },
  
  // Recommended sizes for different actions
  recommended: {
    primary: '48px',     // Primary actions (Show Answer, Review)
    secondary: '44px',   // Secondary actions (Edit, Delete)
    navigation: '48px',  // Navigation buttons (arrows, close)
    settings: '44px'     // Settings and configuration
  },
  
  // Spacing between touch targets
  spacing: {
    minimum: '8px',      // Minimum gap between adjacent targets
    comfortable: '12px'   // Preferred spacing for better accuracy
  }
}
```

### Touch States and Feedback
```javascript
const touchStates = {
  // Visual feedback for touch interactions
  pressed: {
    backgroundColor: 'rgba(45, 90, 135, 0.1)',
    transform: 'scale(0.95)',
    transition: 'all 0.1s ease'
  },
  
  // Loading states for async actions
  loading: {
    opacity: '0.6',
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  
  // Success feedback
  success: {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    duration: '1000ms'
  }
}
```

## Mobile-Specific Components

### Mobile Header Pattern
```javascript
const mobileHeader = {
  // Two-row layout for efficient space usage
  container: {
    backgroundColor: '#ffffff',
    border: '2px solid #4a90b8',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  // First row: Today button, Category selector, Settings button
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '48px' // Touch-friendly height
  },
  
  // Today button (left)
  todayButton: {
    backgroundColor: '#2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '12px 20px',
    fontSize: '16px',
    minHeight: '48px', // Touch target
    flex: '1'
  },
  
  // Category selector (center, flexible width)
  categorySelector: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    color: '#2d5a87',
    padding: '10px 16px',
    fontSize: '14px',
    minHeight: '44px', // Touch target
    flex: '2'
  },
  
  // Settings button (right)
  settingsButton: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    color: '#2d5a87',
    borderRadius: '4px',
    padding: '10px 16px',
    fontSize: '14px',
    minHeight: '44px', // Touch target
    minWidth: '44px'
  },
  
  // Second row: Date navigation (centered)
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '48px' // Touch-friendly height
  },
  
  // Navigation buttons
  navButton: {
    backgroundColor: '#4a90b8',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '14px',
    minHeight: '44px', // Touch target
    minWidth: '44px'
  },
  
  // Date display (center, flexible)
  dateDisplay: {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    color: '#2d5a87',
    padding: '10px 16px',
    fontSize: '14px',
    minHeight: '44px', // Touch target
    textAlign: 'center',
    flex: '1'
  }
}
```

### Mobile Card Interactions
```javascript
const mobileCardPattern = {
  // Full-width card layout
  container: {
    width: '100%',
    margin: '0 0 16px 0',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(30, 58, 95, 0.1)'
  },
  
  // Swipe action areas
  swipeActions: {
    left: {
      // Swipe right for quick review
      action: 'review',
      color: '#4CAF50',
      icon: '✓',
      threshold: '80px'
    },
    right: {
      // Swipe left for edit
      action: 'edit',
      color: '#f5c842',
      icon: '✏️',
      threshold: '80px'
    }
  },
  
  // Long press context menu
  contextMenu: {
    trigger: 'longpress',
    duration: '500ms',
    actions: ['review', 'edit', 'delete', 'archive']
  }
}
```

### Mobile Modal Patterns
```javascript
const mobileModalPattern = {
  // Full-screen modal overlay
  overlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(30, 58, 95, 0.95)',
    zIndex: '1000'
  },
  
  // Modal content container
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column'
  },
  
  // Sticky header with close action
  header: {
    position: 'sticky',
    top: '0',
    height: '56px',
    padding: '0 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #4a90b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  // Scrollable body content
  body: {
    flex: '1',
    padding: '16px',
    overflowY: 'auto'
  },
  
  // Sticky footer for actions
  footer: {
    position: 'sticky',
    bottom: '0',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #4a90b8'
  }
}
```

## Gesture Interactions

### Swipe Gestures
```javascript
const swipeGestures = {
  // Card swipe actions
  cardSwipe: {
    // Horizontal swipe for quick actions
    horizontal: {
      leftToRight: {
        action: 'markReviewed',
        threshold: '50px',
        feedback: 'haptic',
        animation: 'slideRight'
      },
      rightToLeft: {
        action: 'editItem',
        threshold: '50px',
        feedback: 'haptic',
        animation: 'slideLeft'
      }
    }
  },
  
  // Modal dismissal
  modalSwipe: {
    vertical: {
      topToBottom: {
        action: 'dismissModal',
        threshold: '100px',
        area: 'upperThird'
      }
    }
  },
  
  // Image viewer navigation
  imageSwipe: {
    horizontal: {
      leftToRight: 'previousImage',
      rightToLeft: 'nextImage'
    },
    vertical: {
      topToBottom: 'closeViewer',
      bottomToTop: 'closeViewer'
    }
  }
}
```

### Touch and Hold Interactions
```javascript
const longPressActions = {
  // Card long press menu
  cardLongPress: {
    duration: '500ms',
    feedback: 'haptic',
    menu: {
      items: [
        { action: 'review', icon: '📝', label: 'Quick Review' },
        { action: 'edit', icon: '✏️', label: 'Edit Item' },
        { action: 'archive', icon: '📁', label: 'Archive' },
        { action: 'delete', icon: '🗑️', label: 'Delete' }
      ],
      style: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '8px'
      }
    }
  },
  
  // Image long press actions
  imageLongPress: {
    duration: '400ms',
    actions: ['save', 'share', 'copy']
  }
}
```

## Navigation Patterns

### Mobile Navigation Stack
```javascript
const mobileNavigation = {
  // Header navigation
  header: {
    backButton: {
      position: 'left',
      size: '48px',
      icon: '←',
      action: 'goBack'
    },
    title: {
      position: 'center',
      truncation: true,
      maxWidth: '60%'
    },
    actions: {
      position: 'right',
      maxItems: 2,
      overflow: 'menu'
    }
  },
  
  // Tab bar navigation (if needed)
  tabBar: {
    position: 'bottom',
    height: '56px',
    items: [
      { icon: '📚', label: 'Study', route: '/' },
      { icon: '📊', label: 'Progress', route: '/progress' },
      { icon: '⚙️', label: 'Settings', route: '/settings' }
    ]
  }
}
```

### Page Transitions
```javascript
const pageTransitions = {
  // Slide transitions for navigation
  slideIn: {
    from: 'right',
    duration: '300ms',
    easing: 'ease-out'
  },
  
  // Modal slide up
  slideUp: {
    from: 'bottom',
    duration: '250ms',
    easing: 'ease-out'
  },
  
  // Fade for overlays
  fade: {
    duration: '200ms',
    easing: 'ease-in-out'
  }
}
```

## Form Interactions

### Mobile Form Patterns
```javascript
const mobileFormPattern = {
  // Large, touch-friendly inputs
  input: {
    minHeight: '48px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #4a90b8'
  },
  
  // Floating labels to save space
  floatingLabel: {
    position: 'absolute',
    transition: 'all 0.2s ease',
    focused: {
      transform: 'translateY(-20px) scale(0.8)',
      color: '#2d5a87'
    }
  },
  
  // Input grouping for better organization
  inputGroup: {
    marginBottom: '24px',
    spacing: '16px'
  },
  
  // Large action buttons
  submitButton: {
    width: '100%',
    minHeight: '48px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    marginTop: '24px'
  }
}
```

### Keyboard Behavior
```javascript
const keyboardHandling = {
  // Auto-scroll to focused input
  scrollToInput: {
    behavior: 'smooth',
    offset: '20px'
  },
  
  // Keyboard dismissal
  dismissKeyboard: {
    trigger: 'tapOutside',
    submitOnEnter: true
  },
  
  // Input type optimization
  inputTypes: {
    email: 'email',
    number: 'numeric',
    search: 'search',
    url: 'url'
  }
}
```

## Loading and Feedback Patterns

### Loading States
```javascript
const loadingPatterns = {
  // Button loading state
  buttonLoading: {
    opacity: '0.6',
    cursor: 'not-allowed',
    spinner: {
      size: '20px',
      color: '#ffffff'
    }
  },
  
  // Card loading skeleton
  cardSkeleton: {
    backgroundColor: '#e8f0f5',
    animation: 'pulse 1.5s ease-in-out infinite',
    borderRadius: '8px'
  },
  
  // Full page loading
  pageLoading: {
    overlay: true,
    spinner: {
      size: '40px',
      color: '#2d5a87'
    }
  }
}
```

### Success and Error Feedback
```javascript
const feedbackPatterns = {
  // Toast notifications
  toast: {
    position: 'top',
    duration: '3000ms',
    maxWidth: '90%',
    success: {
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      icon: '✓'
    },
    error: {
      backgroundColor: '#f44336',
      color: '#ffffff',
      icon: '⚠️'
    }
  },
  
  // Haptic feedback
  haptic: {
    success: 'notificationSuccess',
    error: 'notificationError',
    selection: 'selectionChanged'
  }
}
```

## Accessibility Considerations

### Mobile Accessibility
```javascript
const mobileA11y = {
  // Voice control support
  voiceControl: {
    labels: 'descriptive',
    actions: 'voice-friendly',
    navigation: 'semantic'
  },
  
  // Screen reader optimization
  screenReader: {
    announcements: 'meaningful',
    landmarks: 'proper',
    focus: 'managed'
  },
  
  // Motor impairment support
  motorSupport: {
    touchTargets: '44px+',
    timeout: 'extended',
    gestures: 'optional'
  }
}
```

### Focus Management
```javascript
const focusManagement = {
  // Modal focus trapping
  modalFocus: {
    trap: true,
    returnTo: 'trigger',
    firstElement: 'closeButton'
  },
  
  // Tab order optimization
  tabOrder: {
    logical: true,
    skipLinks: true,
    focusVisible: true
  }
}
```

## Performance Optimization

### Touch Performance
```javascript
const touchPerformance = {
  // Passive event listeners
  eventListeners: {
    passive: true,
    touchstart: 'passive',
    touchmove: 'passive'
  },
  
  // Debounced interactions
  debouncing: {
    scroll: '16ms',
    resize: '100ms',
    input: '300ms'
  },
  
  // Hardware acceleration
  transforms: {
    use3d: true,
    willChange: 'transform',
    backfaceVisibility: 'hidden'
  }
}
```

This mobile pattern guide ensures consistent, accessible, and performant touch interactions throughout the Mnemos app.