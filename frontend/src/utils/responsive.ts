import type { Breakpoint } from '../hooks/useBreakpoint';

/**
 * Responsive style utilities for consistent styling across breakpoints
 */

// Touch target size utilities
export const getTouchTargetStyles = (size: 'minimum' | 'recommended' | 'large' = 'recommended') => {
  const sizes = {
    minimum: '44px',
    recommended: '48px', 
    large: '56px'
  };
  
  return {
    minWidth: sizes[size],
    minHeight: sizes[size],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
};

// Responsive typography utilities
export const getResponsiveTypography = (breakpoint: Breakpoint) => {
  const typography = {
    mobile: {
      appTitle: { fontSize: '20px', lineHeight: '1.2' },
      modalTitle: { fontSize: '18px', lineHeight: '1.3' },
      cardTitle: { fontSize: '14px', lineHeight: '1.3' },
      bodyText: { fontSize: '14px', lineHeight: '1.4' },
      smallText: { fontSize: '12px', lineHeight: '1.4' },
      buttonText: { fontSize: '16px', lineHeight: '1.2' }
    },
    tablet: {
      appTitle: { fontSize: '22px', lineHeight: '1.2' },
      modalTitle: { fontSize: '18px', lineHeight: '1.3' },
      cardTitle: { fontSize: '13px', lineHeight: '1.3' },
      bodyText: { fontSize: '13px', lineHeight: '1.4' },
      smallText: { fontSize: '11px', lineHeight: '1.4' },
      buttonText: { fontSize: '14px', lineHeight: '1.2' }
    },
    desktop: {
      appTitle: { fontSize: '24px', lineHeight: '1.2' },
      modalTitle: { fontSize: '18px', lineHeight: '1.3' },
      cardTitle: { fontSize: '12px', lineHeight: '1.3' },
      bodyText: { fontSize: '12px', lineHeight: '1.4' },
      smallText: { fontSize: '10px', lineHeight: '1.4' },
      buttonText: { fontSize: '12px', lineHeight: '1.2' }
    },
    wide: {
      appTitle: { fontSize: '26px', lineHeight: '1.2' },
      modalTitle: { fontSize: '20px', lineHeight: '1.3' },
      cardTitle: { fontSize: '12px', lineHeight: '1.3' },
      bodyText: { fontSize: '12px', lineHeight: '1.4' },
      smallText: { fontSize: '10px', lineHeight: '1.4' },
      buttonText: { fontSize: '12px', lineHeight: '1.2' }
    }
  };

  return typography[breakpoint];
};

// Responsive spacing utilities
export const getResponsiveSpacing = (breakpoint: Breakpoint) => {
  const spacing = {
    mobile: {
      containerPadding: '15px',
      cardGap: '15px',
      sectionGap: '20px',
      buttonGap: '12px'
    },
    tablet: {
      containerPadding: '20px',
      cardGap: '15px',
      sectionGap: '25px',
      buttonGap: '10px'
    },
    desktop: {
      containerPadding: '20px',
      cardGap: '10px',
      sectionGap: '30px',
      buttonGap: '5px'
    },
    wide: {
      containerPadding: '20px',
      cardGap: '12px',
      sectionGap: '30px',
      buttonGap: '6px'
    }
  };

  return spacing[breakpoint];
};

// Responsive card dimensions
export const getResponsiveCardStyles = (breakpoint: Breakpoint) => {
  const cardStyles = {
    mobile: {
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto 15px auto',
      padding: '15px',
      borderRadius: '8px'
    },
    tablet: {
      width: 'calc(50% - 10px)',
      minWidth: '200px',
      maxWidth: '300px',
      margin: '0 0 15px 0',
      padding: '12px',
      borderRadius: '6px'
    },
    desktop: {
      width: '140px',
      minHeight: '120px',
      flexShrink: 0,
      margin: '0',
      padding: '10px',
      borderRadius: '6px'
    },
    wide: {
      width: '160px',
      minHeight: '120px',
      flexShrink: 0,
      margin: '0',
      padding: '10px',
      borderRadius: '6px'
    }
  };

  return cardStyles[breakpoint];
};

// Responsive modal styles
export const getResponsiveModalStyles = (breakpoint: Breakpoint, modalType: 'settings' | 'review' | 'edit' | 'answer' | 'default' = 'default') => {
  const baseModalStyles = {
    mobile: {
      overlay: {
        padding: '0'
      },
      content: {
        position: 'absolute' as const,
        left: '15px',
        right: '15px',
        top: '15px',
        bottom: '15px',
        width: 'auto',
        height: 'auto',
        borderRadius: '12px',
        padding: '20px'
      }
    },
    tablet: {
      overlay: {
        padding: '20px'
      },
      content: {
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '80vh',
        borderRadius: '12px',
        padding: '20px'
      }
    },
    desktop: {
      overlay: {
        padding: '0'
      },
      content: {
        borderRadius: '12px',
        padding: '20px'
      }
    },
    wide: {
      overlay: {
        padding: '0'
      },
      content: {
        borderRadius: '12px',
        padding: '20px'
      }
    }
  };

  // Modal-specific sizing for desktop/wide
  const modalSpecificSizes = {
    settings: {
      desktop: { width: '450px', maxHeight: '80vh' },
      wide: { width: '450px', maxHeight: '80vh' }
    },
    review: {
      desktop: { width: '400px', height: '300px' },
      wide: { width: '400px', height: '300px' }
    },
    edit: {
      desktop: { width: '640px', height: '540px' },
      wide: { width: '640px', height: '540px' }
    },
    answer: {
      desktop: { width: '500px', maxHeight: '90vh' },
      wide: { width: '500px', maxHeight: '90vh' }
    },
    default: {
      desktop: { width: '450px', maxHeight: '80vh' },
      wide: { width: '450px', maxHeight: '80vh' }
    }
  };

  const styles = baseModalStyles[breakpoint];
  
  // Add modal-specific sizing for desktop and wide screens
  if ((breakpoint === 'desktop' || breakpoint === 'wide') && modalSpecificSizes[modalType]) {
    styles.content = {
      ...styles.content,
      ...modalSpecificSizes[modalType][breakpoint]
    };
  }

  return styles;
};

// Responsive button styles
export const getResponsiveButtonStyles = (breakpoint: Breakpoint, type: 'primary' | 'secondary' | 'small' = 'primary') => {
  const buttonStyles = {
    mobile: {
      primary: {
        padding: '12px 20px',
        fontSize: '16px',
        ...getTouchTargetStyles('recommended')
      },
      secondary: {
        padding: '10px 16px',
        fontSize: '14px',
        ...getTouchTargetStyles('minimum')
      },
      small: {
        padding: '8px 12px',
        fontSize: '14px',
        ...getTouchTargetStyles('minimum')
      }
    },
    tablet: {
      primary: {
        padding: '10px 16px',
        fontSize: '14px',
        ...getTouchTargetStyles('minimum')
      },
      secondary: {
        padding: '8px 12px',
        fontSize: '13px',
        minHeight: '40px'
      },
      small: {
        padding: '6px 10px',
        fontSize: '12px',
        minHeight: '36px'
      }
    },
    desktop: {
      primary: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      secondary: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      small: {
        padding: '3px 8px',
        fontSize: '11px'
      }
    },
    wide: {
      primary: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      secondary: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      small: {
        padding: '3px 8px',
        fontSize: '11px'
      }
    }
  };

  return buttonStyles[breakpoint][type];
};

// Utility to merge responsive styles with base styles
export const mergeResponsiveStyles = (baseStyles: React.CSSProperties, responsiveStyles: React.CSSProperties) => {
  return {
    ...baseStyles,
    ...responsiveStyles
  };
};