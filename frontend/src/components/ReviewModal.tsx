import React, { useState } from 'react';
import type { StudyItem } from './ItemCard';
import type { AppSettings } from '../types/Settings';
import { useResponsive } from '../hooks/useBreakpoint';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { getResponsiveModalStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReview: (itemId: string, reviewType: 'confident' | 'medium' | 'wtf' | 'custom', customDays?: number) => void;
  onArchive: (itemId: string) => void;
  item: StudyItem | null;
  settings: AppSettings;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReview,
  onArchive,
  item,
  settings
}) => {
  const [customDays, setCustomDays] = useState<number>(1);

  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);

  // Responsive design integration (must be before conditional return)
  const { breakpoint } = useResponsive();
  const responsiveModal = getResponsiveModalStyles(breakpoint, 'review');
  const responsiveTypography = getResponsiveTypography(breakpoint);
  const responsiveSpacing = getResponsiveSpacing(breakpoint);

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

  const overlayStyle = mergeResponsiveStyles({
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
  }, responsiveModal.overlay);

  const modalStyle = mergeResponsiveStyles({
    backgroundColor: '#ffffff',
    border: '3px solid #4a90b8',
    position: 'relative' as const,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column' as const
  }, responsiveModal.content);

  const titleStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap,
    textAlign: 'center' as const
  }, responsiveTypography.modalTitle);

  const itemNameStyle = mergeResponsiveStyles({
    color: '#2d5a87',
    marginBottom: responsiveSpacing.sectionGap,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const
  }, responsiveTypography.bodyText);

  const closeButtonStyle = mergeResponsiveStyles({
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    color: '#2d5a87',
    cursor: 'pointer'
  }, getResponsiveButtonStyles(breakpoint, 'small'));

  const confidenceButtonsStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: responsiveSpacing.buttonGap,
    marginBottom: responsiveSpacing.sectionGap
  };

  const confidentButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#4CAF50',
    border: '1px solid #4CAF50',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

  const mediumButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2196F3',
    border: '1px solid #2196F3',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

  const wtfButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#F44336',
    border: '1px solid #F44336',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

  const customSectionStyle = {
    marginBottom: responsiveSpacing.sectionGap
  };

  const customLabelStyle = mergeResponsiveStyles({
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap,
    display: 'block'
  }, responsiveTypography.smallText);

  const customInputContainerStyle = {
    display: 'flex',
    gap: responsiveSpacing.buttonGap,
    alignItems: 'center'
  };

  const customInputStyle = mergeResponsiveStyles({
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    color: '#2d5a87',
    width: '80px'
  }, getResponsiveButtonStyles(breakpoint, 'small'));

  const customButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const archiveButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#1a2e42',
    border: '1px solid #1a2e42',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    marginTop: 'auto'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

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
            <span>Review in {settings.confidentDays} day{settings.confidentDays !== 1 ? 's' : ''}</span>
          </button>

          <button
            style={mediumButtonStyle}
            onClick={() => handleConfidenceClick('medium')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            <span>🔵 Medium</span>
            <span>Review in {settings.mediumDays} day{settings.mediumDays !== 1 ? 's' : ''}</span>
          </button>

          <button
            style={wtfButtonStyle}
            onClick={() => handleConfidenceClick('wtf')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
          >
            <span>🔴 WTF</span>
            <span>Review in {settings.wtfDays} day{settings.wtfDays !== 1 ? 's' : ''}</span>
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
            <span style={mergeResponsiveStyles({ color: '#2d5a87' }, responsiveTypography.smallText)}>days</span>
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