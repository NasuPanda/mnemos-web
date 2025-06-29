import React, { useState } from 'react';
import ImageViewerModal from './ImageViewerModal';

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


  const cardStyle = {
    width: '140px',
    minHeight: '120px',
    flexShrink: 0,
    borderRadius: '6px',
    padding: '10px',
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
  };

  const titleStyle = {
    fontSize: '12px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    margin: '0 0 5px 0',
    opacity: item.isReviewed ? 0.8 : 1,
    overflow: 'hidden',
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    lineHeight: '1.4'
  };

  const problemStyle = {
    fontSize: '12px',
    color: '#2d5a87',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
    opacity: item.isReviewed ? 0.8 : 1,
    flexGrow: 1,
    overflow: 'hidden',
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const
  };

  const mediaIndicatorsStyle = {
    display: 'flex',
    gap: '3px',
    marginBottom: '5px'
  };

  const mediaButtonStyle = {
    fontSize: '10px',
    padding: '2px 4px',
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '2px',
    color: '#2d5a87',
    cursor: 'pointer'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3px',
    marginTop: 'auto'
  };

  const showAnswerButtonStyle = {
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '2px',
    padding: '5px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const actionButtonsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '3px'
  };

  const editButtonStyle = {
    backgroundColor: '#f5c842',
    border: '1px solid #f5c842',
    color: '#1e3a5f',
    borderRadius: '2px',
    padding: '3px 7px',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const deleteButtonStyle = {
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '2px',
    padding: '3px 7px',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const timestampStyle = {
    fontSize: '10px',
    color: '#4a90b8',
    textAlign: 'center' as const,
    marginTop: '2px',
    opacity: item.isReviewed ? 0.8 : 1
  };

  const reviewedIndicatorStyle = {
    fontSize: '10px',
    color: '#2d5a87',
    textAlign: 'center' as const,
    margin: '2px 0 0 0',
    opacity: 0.8
  };

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
          const allImages = [...(item.problemImages || []), ...(item.answerImages || [])];
          if (allImages.length > 0) {
            setViewingImages(allImages);
            setImageViewerTitle(`${item.name} - Images`);
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