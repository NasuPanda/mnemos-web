import React, { useState } from 'react';
import type { StudyItem } from './ItemCard';
import ImageViewerModal from './ImageViewerModal';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ShowAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StudyItem | null;
}

const ShowAnswerModal: React.FC<ShowAnswerModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [imageViewerTitle, setImageViewerTitle] = useState('');

  const handleImageClick = (images: string[], title: string) => {
    setViewingImages(images);
    setImageViewerTitle(title);
    setIsImageViewerOpen(true);
  };

  if (!isOpen || !item) return null;

  const overlayStyle = {
    backgroundColor: 'rgba(30, 58, 95, 0.4)',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    border: '3px solid #4a90b8',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative' as const,
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '10px',
    textAlign: 'center' as const
  };

  const itemNameStyle = {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#2d5a87',
    marginBottom: '20px',
    textAlign: 'center' as const
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#2d5a87',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const sectionStyle = {
    marginBottom: '20px'
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '10px',
    borderBottom: '1px solid #4a90b8',
    paddingBottom: '5px'
  };

  const contentStyle = {
    fontSize: '12px',
    color: '#2d5a87',
    lineHeight: '1.5',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#e8f0f5',
    borderRadius: '4px',
    border: '1px solid #4a90b8'
  };


  const imageButtonStyle = {
    backgroundColor: '#4a90b8',
    border: '1px solid #4a90b8',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    marginBottom: '10px'
  };

  const emptyStateStyle = {
    fontSize: '12px',
    color: '#4a90b8',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    padding: '20px'
  };

  const linkStyle = {
    color: '#2d5a87',
    textDecoration: 'underline',
    fontSize: '12px',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
    display: 'block',
    marginBottom: '8px'
  };

  // Function to render answer content with URLs as clickable links
  const renderAnswerContent = (answer: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = answer.match(urlRegex);
    const textWithoutUrls = answer.replace(urlRegex, '').trim();
    
    return (
      <>
        {textWithoutUrls && (
          <div style={contentStyle}>
            {textWithoutUrls}
          </div>
        )}
        {urls && urls.length > 0 && (
          <div style={{ marginTop: textWithoutUrls ? '10px' : '0' }}>
            <div style={sectionTitleStyle}>Links</div>
            {urls.map((url, index) => (
              <a 
                key={index}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {url}
              </a>
            ))}
          </div>
        )}
      </>
    );
  };

  const hasAnswerContent = item.answer && item.answer.trim().length > 0;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
        >
          ✕
        </button>

        <h2 style={titleStyle}>Answer</h2>
        <div style={itemNameStyle}>"{item.name}"</div>

        {item.problem && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Problem</div>
            <div style={contentStyle}>
              {item.problem}
            </div>
          </div>
        )}

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Answer</div>
          {hasAnswerContent ? (
            renderAnswerContent(item.answer)
          ) : (
            <div style={emptyStateStyle}>
              No answer provided for this item.
            </div>
          )}
        </div>

        {((item.problemImages && item.problemImages.length > 0) || (item.answerImages && item.answerImages.length > 0)) && (() => {
          const allImages = [...(item.problemImages || []), ...(item.answerImages || [])];
          return (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Images</div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '100%'
              }}>
                {allImages.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      border: '2px solid #4a90b8',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff'
                    }}
                    onClick={() => handleImageClick(allImages, 'Images')}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </div>
      
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={viewingImages}
        title={imageViewerTitle}
      />
    </div>
  );
};

export default ShowAnswerModal;