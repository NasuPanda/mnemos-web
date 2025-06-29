import React from 'react';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const cardStyle = {
    width: '110px',
    height: '100px',
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
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const titleStyle = {
    fontSize: '10px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    margin: '0 0 5px 0',
    opacity: item.isReviewed ? 0.8 : 1
  };

  const problemStyle = {
    fontSize: '8px',
    color: '#2d5a87',
    margin: '0 0 8px 0',
    lineHeight: '1.2',
    opacity: item.isReviewed ? 0.8 : 1,
    flexGrow: 1
  };

  const mediaIndicatorsStyle = {
    display: 'flex',
    gap: '3px',
    marginBottom: '5px'
  };

  const mediaButtonStyle = {
    fontSize: '6px',
    padding: '1px 3px',
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
    padding: '3px 6px',
    fontSize: '7px',
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
    padding: '2px 6px',
    fontSize: '7px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const deleteButtonStyle = {
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '2px',
    padding: '2px 6px',
    fontSize: '7px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const timestampStyle = {
    fontSize: '6px',
    color: '#4a90b8',
    textAlign: 'center' as const,
    marginTop: '2px',
    opacity: item.isReviewed ? 0.8 : 1
  };

  const reviewedIndicatorStyle = {
    fontSize: '6px',
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
        {truncateText(item.name, 15)}
      </div>
      
      <div style={problemStyle}>
        {truncateText(item.problem, 60)}
      </div>

      {(item.hasLink || item.hasImage) && (
        <div style={mediaIndicatorsStyle}>
          {item.hasLink && (
            <button style={mediaButtonStyle}>
              📎 Link
            </button>
          )}
          {item.hasImage && (
            <button style={mediaButtonStyle}>
              🖼️ Image
            </button>
          )}
        </div>
      )}

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
    </div>
  );
};

export default ItemCard;