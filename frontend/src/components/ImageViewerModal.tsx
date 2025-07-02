import React, { useEffect, useState } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title?: string;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  images,
  title = "Images"
}) => {
  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle ESC key
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const swipeThreshold = 50; // Minimum distance for swipe

    // Swipe up or down to close
    if (Math.abs(deltaY) > swipeThreshold) {
      onClose();
    }

    setTouchStartY(null);
  };

  if (!isOpen || images.length === 0) return null;

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  const headerStyle = {
    position: 'absolute' as const,
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textAlign: 'center' as const
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const contentStyle = {
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    alignItems: 'center'
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '70vh',
    border: '3px solid #ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    objectFit: 'contain' as const
  };

  const imageCountStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textAlign: 'center' as const,
    marginBottom: '10px'
  };

  return (
    <div 
      style={overlayStyle} 
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={headerStyle}>
        {title}
      </div>

      <button
        style={closeButtonStyle}
        onClick={onClose}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      >
        ×
      </button>

      <div 
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <div style={imageCountStyle}>
            {images.length} image{images.length > 1 ? 's' : ''}
          </div>
        )}
        
        {images.map((imagePath, index) => (
          <img
            key={index}
            src={imagePath}
            alt={`Image ${index + 1}`}
            style={imageStyle}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageViewerModal;