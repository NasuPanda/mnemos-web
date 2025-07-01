import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

const breakpoints: BreakpointConfig = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

/**
 * Custom hook to detect current breakpoint
 * Returns the current breakpoint based on window width
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.tablet) {
        setBreakpoint('mobile');
      } else if (width < breakpoints.desktop) {
        setBreakpoint('tablet');
      } else if (width < breakpoints.wide) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('wide');
      }
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Hook to check if current breakpoint matches criteria
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Utility functions for responsive checks
 */
export const useResponsive = () => {
  const breakpoint = useBreakpoint();
  
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
    isDesktopOrWide: breakpoint === 'desktop' || breakpoint === 'wide',
    isTouchDevice: breakpoint === 'mobile' || breakpoint === 'tablet'
  };
};