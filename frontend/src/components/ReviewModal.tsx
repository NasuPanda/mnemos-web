import React, { useState } from 'react';
import type { StudyItem } from './ItemCard';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReview: (itemId: string, reviewType: 'confident' | 'medium' | 'wtf' | 'custom', customDays?: number) => void;
  onArchive: (itemId: string) => void;
  item: StudyItem | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReview,
  onArchive,
  item
}) => {
  const [customDays, setCustomDays] = useState<number>(1);

  const handleConfidenceClick = (type: 'confident' | 'medium' | 'wtf') => {
    if (!item) return;
    onReview(item.id, type);
    onClose();
  };

  const handleCustomReview = () => {
    if (!item) return;
    onReview(item.id, 'custom', customDays);
    onClose();
  };

  const handleArchive = () => {
    if (!item) return;
    onArchive(item.id);
    onClose();
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
    width: '400px',
    height: '300px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column' as const
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '10px',
    textAlign: 'center' as const
  };

  const itemNameStyle = {
    fontSize: '14px',
    color: '#2d5a87',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontStyle: 'italic' as const
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

  const confidenceButtonsStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '20px'
  };

  const confidentButtonStyle = {
    backgroundColor: '#4CAF50',
    border: '1px solid #4CAF50',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const mediumButtonStyle = {
    backgroundColor: '#2196F3',
    border: '1px solid #2196F3',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const wtfButtonStyle = {
    backgroundColor: '#F44336',
    border: '1px solid #F44336',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const customSectionStyle = {
    marginBottom: '15px'
  };

  const customLabelStyle = {
    fontSize: '12px',
    color: '#1e3a5f',
    marginBottom: '5px',
    display: 'block'
  };

  const customInputContainerStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  };

  const customInputStyle = {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2d5a87',
    width: '80px'
  };

  const customButtonStyle = {
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const archiveButtonStyle = {
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    marginTop: 'auto'
  };

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

        <h2 style={titleStyle}>Review Item</h2>
        <div style={itemNameStyle}>"{item.name}"</div>

        <div style={confidenceButtonsStyle}>
          <button
            style={confidentButtonStyle}
            onClick={() => handleConfidenceClick('confident')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            <span>🟢 Confident</span>
            <span>Review in 7 days</span>
          </button>

          <button
            style={mediumButtonStyle}
            onClick={() => handleConfidenceClick('medium')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            <span>🔵 Medium</span>
            <span>Review in 3 days</span>
          </button>

          <button
            style={wtfButtonStyle}
            onClick={() => handleConfidenceClick('wtf')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
          >
            <span>🔴 WTF</span>
            <span>Review in 1 day</span>
          </button>
        </div>

        <div style={customSectionStyle}>
          <label style={customLabelStyle}>Custom Review Date:</label>
          <div style={customInputContainerStyle}>
            <input
              type="number"
              min="1"
              max="365"
              style={customInputStyle}
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
            />
            <span style={{ fontSize: '12px', color: '#2d5a87' }}>days</span>
            <button
              style={customButtonStyle}
              onClick={handleCustomReview}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
            >
              Set Review
            </button>
          </div>
        </div>

        <button
          style={archiveButtonStyle}
          onClick={handleArchive}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f1a2a'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a2e42'}
        >
          Archive Item
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;