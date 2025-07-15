import React, { useState } from 'react';
import ImageViewerModal from './ImageViewerModal';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveCardStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

export interface StudyItem {
  id: string;
  name: string;
  problem: string;
  answer: string;
  category: string;
  createdAt: string;
  lastAccessedAt?: string;
  isReviewed: boolean;
  hasLink?: boolean;
  hasImage?: boolean;
  
  // Review system fields
  nextReviewDate?: string; // ISO date string (YYYY-MM-DD)
  reviewDates?: string[];  // Array of past review dates
  
  // Archive system
  archived?: boolean;
  
  // Extended fields for complete testing
  sideNote?: string;
  problemUrl?: string;
  problemImages?: string[];
  answerUrl?: string;
  answerImages?: string[];
}

interface ItemCardProps {
  item: StudyItem;
  onShowAnswer: (item: StudyItem) => void;
  onEdit: (item: StudyItem) => void;
  onDelete: (item: StudyItem) => void;
  onDoubleClick: (item: StudyItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onShowAnswer,
  onEdit,
  onDelete,
  onDoubleClick
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [imageViewerTitle, setImageViewerTitle] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Responsive design integration
  const { breakpoint } = useResponsive();
  const responsiveCard = getResponsiveCardStyles(breakpoint);
  const responsiveTypography = getResponsiveTypography(breakpoint);
  const responsiveSpacing = getResponsiveSpacing(breakpoint);

  const cardStyle = mergeResponsiveStyles({
    // Base styles that remain consistent
    boxSizing: 'border-box' as const,
    backgroundColor: item.isReviewed ? '#e8f0f5' : '#ffffff',
    border: item.isReviewed ? '1px solid #4a90b8' : '2px solid #2d5a87',
    opacity: item.isReviewed ? 0.7 : 1,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
    wordWrap: 'break-word' as const
  }, responsiveCard);

  const titleStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    margin: `0 0 ${responsiveSpacing.buttonGap} 0`,
    opacity: item.isReviewed ? 0.8 : 1,
    overflow: 'hidden',
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const
  }, responsiveTypography.cardTitle);

  const problemStyle = mergeResponsiveStyles({
    color: '#2d5a87',
    margin: `0 0 ${responsiveSpacing.buttonGap} 0`,
    opacity: item.isReviewed ? 0.8 : 1,
    flexGrow: 1,
    overflow: 'hidden',
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const
  }, responsiveTypography.bodyText);

  const mediaIndicatorsStyle = {
    display: 'flex',
    gap: responsiveSpacing.buttonGap,
    marginBottom: responsiveSpacing.buttonGap
  };

  const mediaButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '2px',
    color: '#2d5a87',
    cursor: 'pointer'
  }, getResponsiveButtonStyles(breakpoint, 'small'));

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: responsiveSpacing.buttonGap,
    marginTop: 'auto'
  };

  const showAnswerButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '2px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

  const actionButtonsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: responsiveSpacing.buttonGap
  };

  const editButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#f5c842',
    border: '1px solid #f5c842',
    color: '#1e3a5f',
    borderRadius: '2px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const deleteButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '2px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const timestampStyle = mergeResponsiveStyles({
    color: '#4a90b8',
    textAlign: 'center' as const,
    marginTop: '2px',
    opacity: item.isReviewed ? 0.8 : 1
  }, responsiveTypography.smallText);

  const reviewedIndicatorStyle = mergeResponsiveStyles({
    color: '#2d5a87',
    textAlign: 'center' as const,
    margin: '2px 0 0 0',
    opacity: 0.8
  }, responsiveTypography.smallText);

  return (
    <div 
      style={cardStyle}
      onDoubleClick={() => onDoubleClick(item)}
    >
      <div style={titleStyle}>
        {item.name}
      </div>
      
      <div style={problemStyle}>
        {item.problem}
      </div>

      {(() => {
        const hasLinks = !!(item.problemUrl || item.answerUrl);
        const hasImages = !!(item.problemImages?.length || item.answerImages?.length);
        
        const handleLinkClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          const url = item.problemUrl || item.answerUrl;
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        };
        
        const handleImageClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          const problemImages = item.problemImages || [];
          if (problemImages.length > 0) {
            setViewingImages(problemImages);
            setImageViewerTitle(`${item.name} - Problem Images`);
            setIsImageViewerOpen(true);
          }
        };
        
        const imageCount = (item.problemImages?.length || 0) + (item.answerImages?.length || 0);
        
        return (hasLinks || hasImages) ? (
          <div style={mediaIndicatorsStyle}>
            {hasLinks && (
              <button 
                style={mediaButtonStyle}
                onClick={handleLinkClick}
                title={item.problemUrl || item.answerUrl}
              >
                📎 Link
              </button>
            )}
            {hasImages && (
              <button 
                style={mediaButtonStyle}
                onClick={handleImageClick}
                title={`${imageCount} image${imageCount > 1 ? 's' : ''}`}
              >
                🖼️ {imageCount > 1 ? `${imageCount}` : 'Image'}
              </button>
            )}
          </div>
        ) : null;
      })()}

      <div style={buttonsContainerStyle}>
        <button 
          style={showAnswerButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            onShowAnswer(item);
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
        >
          Show Answer
        </button>

        <div style={actionButtonsStyle}>
          <button 
            style={editButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7d666'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5c842'}
          >
            Edit
          </button>
          <button 
            style={deleteButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f1a2a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a2e42'}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={timestampStyle}>
        {formatDate(item.lastAccessedAt || item.createdAt)}
      </div>

      {item.isReviewed && (
        <div style={reviewedIndicatorStyle}>
          ✓ Reviewed
        </div>
      )}
      
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={viewingImages}
        title={imageViewerTitle}
      />
    </div>
  );
};

export default ItemCard;