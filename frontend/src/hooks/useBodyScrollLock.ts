import { useEffect } from 'react';

/**
 * Custom hook to prevent background scrolling when modals are open
 * Automatically locks/unlocks body scroll based on the isOpen parameter
 */
export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Save original overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
};