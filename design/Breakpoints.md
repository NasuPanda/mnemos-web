# Breakpoint System Documentation

## Overview
This document defines the breakpoint system for Mnemos responsive design implementation. The system uses a mobile-first approach with four primary breakpoints optimized for modern device usage patterns.

## Breakpoint Definitions

### Primary Breakpoints
```javascript
const breakpoints = {
  mobile: {
    min: '0px',
    max: '767px',
    devices: ['iPhone SE', 'iPhone 12/13/14', 'Android phones'],
    orientation: 'portrait',
    typical: '375px'
  },
  
  tablet: {
    min: '768px', 
    max: '1023px',
    devices: ['iPad', 'iPad Air', 'Android tablets'],
    orientation: 'portrait/landscape',
    typical: '768px'
  },
  
  desktop: {
    min: '1024px',
    max: '1439px', 
    devices: ['Laptops', 'Desktop monitors'],
    orientation: 'landscape',
    typical: '1280px'
  },
  
  wide: {
    min: '1440px',
    max: 'infinite',
    devices: ['Large monitors', '4K displays'],
    orientation: 'landscape',
    typical: '1920px'
  }
}
```

### Tailwind CSS Mapping
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      // Mobile-first approach (min-width)
      'sm': '640px',   // Small tablets and large phones
      'md': '768px',   // Tablets
      'lg': '1024px',  // Laptops and desktops
      'xl': '1280px',  // Large desktops
      '2xl': '1536px'  // Extra large screens
    }
  }
}
```

## Component Behavior by Breakpoint

### Header Component

#### Mobile (0px - 767px)
**Layout**: Two-row layout for efficient space usage
```javascript
const headerMobile = {
  container: {
    flexDirection: 'column',
    height: 'auto',
    padding: '15px',
    gap: '12px'
  },
  
  // Title section (full width, centered)
  title: {
    textAlign: 'center',
    marginBottom: '12px'
  },
  
  // First row: Today + Category + Settings (horizontal)
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '48px'
  },
  
  // Today button (left, flexible)
  todayButton: {
    flex: '1',
    minHeight: '48px',
    padding: '12px 20px',
    fontSize: '16px'
  },
  
  // Category selector (center, more flexible width)
  categorySelector: {
    flex: '2',
    minHeight: '44px',
    padding: '10px 16px',
    fontSize: '14px'
  },
  
  // Settings button (right, fixed width)
  settingsButton: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '10px 16px',
    fontSize: '14px'
  },
  
  // Second row: Date navigation (horizontal, centered)
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '48px'
  },
  
  // Navigation buttons
  navButtons: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '8px 12px'
  },
  
  // Date display (center, flexible)
  dateDisplay: {
    flex: '1',
    minHeight: '44px',
    padding: '10px 16px',
    textAlign: 'center'
  }
}
```

#### Tablet (768px - 1023px)
**Layout**: Horizontal with responsive grouping
```javascript
const headerTablet = {
  container: {
    flexDirection: 'row',
    height: '70px',
    padding: '0 20px',
    justifyContent: 'space-between'
  },
  
  // Left section: Today + Category
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  // Center: Date navigation
  centerSection: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  
  // Right: Settings
  rightSection: {
    display: 'flex',
    alignItems: 'center'
  }
}
```

#### Desktop (1024px+)
**Layout**: Current implementation maintained
- No changes to existing desktop layout
- Enhanced keyboard navigation support

### ItemCard Component

#### Mobile (0px - 767px)
**Layout**: Single column, full-width cards
```javascript
const cardMobile = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 15px auto',
    padding: '15px',
    borderRadius: '8px'
  },
  
  title: {
    fontSize: '14px',
    lineHeight: '1.3',
    marginBottom: '8px'
  },
  
  content: {
    fontSize: '14px',
    lineHeight: '1.4',
    marginBottom: '12px'
  },
  
  buttons: {
    gap: '8px',
    marginTop: '15px'
  },
  
  primaryButton: {
    padding: '12px 20px',
    fontSize: '16px',
    minHeight: '48px'
  },
  
  secondaryButtons: {
    padding: '10px 16px',
    fontSize: '14px',
    minHeight: '44px'
  }
}
```

#### Tablet (768px - 1023px)
**Layout**: Grid layout with 2-3 cards per row
```javascript
const cardTablet = {
  container: {
    width: 'calc(50% - 10px)',
    minWidth: '200px',
    maxWidth: '300px',
    padding: '12px'
  },
  
  title: {
    fontSize: '13px',
    lineHeight: '1.3'
  },
  
  content: {
    fontSize: '13px',
    lineHeight: '1.4'
  },
  
  buttons: {
    gap: '6px'
  },
  
  primaryButton: {
    padding: '8px 14px',
    fontSize: '14px'
  }
}
```

#### Desktop (1024px - 1439px)
**Layout**: Current horizontal scroll implementation
```javascript
const cardDesktop = {
  container: {
    width: '140px',
    minHeight: '120px',
    flexShrink: 0,
    padding: '10px'
  }
  // All other styles remain as current implementation
}
```

#### Wide (1440px+)
**Layout**: Enhanced desktop with larger cards
```javascript
const cardWide = {
  container: {
    width: '160px',
    minHeight: '120px',
    flexShrink: 0,
    padding: '10px'
  }
}
```

### Modal Components

#### Mobile (0px - 767px)
**Layout**: Full-screen modals
```javascript
const modalMobile = {
  overlay: {
    padding: '0'
  },
  
  content: {
    width: '100vw',
    height: '100vh',
    borderRadius: '0',
    padding: '20px',
    overflow: 'auto'
  },
  
  header: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#ffffff',
    padding: '15px 0',
    borderBottom: '1px solid #4a90b8'
  },
  
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    minHeight: '44px',
    minWidth: '44px'
  }
}
```

#### Tablet (768px - 1023px)
**Layout**: Large centered modals
```javascript
const modalTablet = {
  overlay: {
    padding: '20px'
  },
  
  content: {
    width: '90vw',
    maxWidth: '600px',
    maxHeight: '80vh',
    borderRadius: '12px',
    margin: '0 auto'
  }
}
```

#### Desktop (1024px+)
**Layout**: Current modal sizing maintained
- ReviewModal: 400px × 300px
- EditModal: 640px × 540px  
- SettingsModal: 450px × auto

### ItemGrid Layout

#### Mobile (0px - 767px)
**Layout**: Vertical stack
```css
.item-grid-mobile {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 15px;
}
```

#### Tablet (768px - 1023px)
**Layout**: Responsive grid
```css
.item-grid-tablet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
```

#### Desktop (1024px+)
**Layout**: Horizontal scroll (current)
```css
.item-grid-desktop {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}
```

## Implementation Guidelines

### CSS Media Queries
```css
/* Mobile First Approach */
.component {
  /* Mobile styles (0px+) */
  display: block;
  width: 100%;
}

@media (min-width: 768px) {
  /* Tablet styles */
  .component {
    display: flex;
    width: auto;
  }
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .component {
    max-width: 1200px;
  }
}

@media (min-width: 1440px) {
  /* Wide screen styles */
  .component {
    max-width: 1400px;
  }
}
```

### React Responsive Hooks
```javascript
// Custom hook for responsive behavior
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('mobile');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else if (width < 1440) setBreakpoint('desktop');
      else setBreakpoint('wide');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};
```

### Tailwind Responsive Classes
```javascript
// Example responsive component
const ResponsiveCard = () => (
  <div className="
    w-full max-w-sm mx-auto mb-4
    md:w-1/2 md:max-w-xs md:mx-0
    lg:w-auto lg:max-w-none lg:flex-shrink-0
    xl:w-40
  ">
    {/* Card content */}
  </div>
);
```

## Testing Guidelines

### Device Testing Strategy
```javascript
const testingDevices = {
  mobile: [
    { name: 'iPhone SE', width: '375px', height: '667px' },
    { name: 'iPhone 12', width: '390px', height: '844px' },
    { name: 'Pixel 5', width: '393px', height: '851px' }
  ],
  
  tablet: [
    { name: 'iPad', width: '768px', height: '1024px' },
    { name: 'iPad Air', width: '820px', height: '1180px' },
    { name: 'Galaxy Tab', width: '800px', height: '1280px' }
  ],
  
  desktop: [
    { name: 'Laptop', width: '1366px', height: '768px' },
    { name: 'Desktop', width: '1920px', height: '1080px' },
    { name: '4K', width: '3840px', height: '2160px' }
  ]
}
```

### Breakpoint Testing Checklist
- [ ] **Mobile (375px)**: All content visible, touch targets adequate
- [ ] **Mobile (320px)**: Minimum width support
- [ ] **Tablet (768px)**: Proper grid layout, adequate spacing
- [ ] **Tablet (1024px)**: Transition to desktop layout works
- [ ] **Desktop (1280px)**: Current functionality maintained
- [ ] **Wide (1920px)**: Content doesn't become too stretched

### Browser DevTools Testing
```javascript
// Common testing breakpoints in browser DevTools
const testBreakpoints = [
  320,  // Small mobile
  375,  // iPhone
  414,  // Large mobile
  768,  // iPad portrait
  1024, // iPad landscape / small desktop
  1280, // Desktop
  1440, // Large desktop
  1920  // Full HD
];
```

## Migration Strategy

### Phase 1: Infrastructure
1. Update Tailwind config with breakpoints
2. Create responsive utility functions
3. Set up testing environment

### Phase 2: Core Components
1. Make ItemCard responsive
2. Update Modal components
3. Implement responsive Header

### Phase 3: Layout Systems
1. Implement responsive ItemGrid
2. Add responsive typography
3. Optimize touch interactions

### Performance Considerations

#### Critical CSS for Each Breakpoint
```javascript
const criticalCSS = {
  mobile: {
    // Essential mobile styles
    load: 'immediate',
    size: '<10KB'
  },
  tablet: {
    // Tablet-specific styles
    load: 'after-mobile',
    size: '<5KB'
  },
  desktop: {
    // Desktop enhancements
    load: 'progressive',
    size: '<5KB'
  }
}
```

This breakpoint system ensures consistent behavior across all device sizes while maintaining the app's core functionality and design principles.