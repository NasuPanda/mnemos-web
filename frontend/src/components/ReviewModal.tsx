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

  // Device-specific behavior
  const isMobile = breakpoint === 'mobile';

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

  const modalStyle = isMobile
    ? mergeResponsiveStyles({
        backgroundColor: '#ffffff',
        border: '3px solid #4a90b8',
        position: 'relative' as const,
        fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column' as const,
        maxHeight: '90vh',
        maxWidth: '90vw',
        width: 'auto',
        minWidth: '280px',
        overflow: 'hidden'
      }, responsiveModal.content)
    : {
        backgroundColor: '#ffffff',
        border: '3px solid #4a90b8',
        position: 'relative' as const,
        fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column' as const,
        // Desktop: flexible height, no constraints from responsive system
        width: '600px',
        minWidth: '500px',
        borderRadius: '12px',
        padding: '20px'
      };

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
    gap: isMobile ? '16px' : responsiveSpacing.buttonGap, // Increased spacing for mobile
    marginBottom: responsiveSpacing.sectionGap
  };

  // Base button style for confidence buttons with mobile-specific fixes
  const baseConfidenceButtonStyle = {
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: isMobile ? '48px' : 'auto',
    padding: isMobile ? '12px 16px' : '8px 12px',
    // Mobile-specific fixes
    width: isMobile ? '100%' : 'auto',
    minWidth: isMobile ? '280px' : 'auto',
    boxSizing: 'border-box' as const
  };

  const confidentButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#4CAF50',
    border: '1px solid #4CAF50',
    color: '#ffffff',
    ...baseConfidenceButtonStyle
  }, isMobile ? {} : getResponsiveButtonStyles(breakpoint, 'primary'));

  const mediumButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2196F3',
    border: '1px solid #2196F3',
    color: '#ffffff',
    ...baseConfidenceButtonStyle
  }, isMobile ? {} : getResponsiveButtonStyles(breakpoint, 'primary'));

  const wtfButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#F44336',
    border: '1px solid #F44336',
    color: '#ffffff',
    ...baseConfidenceButtonStyle
  }, isMobile ? {} : getResponsiveButtonStyles(breakpoint, 'primary'));

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

  // Span styles for proper text distribution in confidence buttons
  const leftSpanStyle = {
    flex: '0 0 auto',
    textAlign: 'left' as const
  };

  const rightSpanStyle = {
    flex: '0 0 auto',
    textAlign: 'right' as const
  };

  const reviewHistoryStyle = {
    marginBottom: responsiveSpacing.sectionGap
  };

  const reviewHistoryTitleStyle = mergeResponsiveStyles({
    color: '#1e3a5f',
    fontWeight: 'bold' as const,
    marginBottom: responsiveSpacing.buttonGap
  }, responsiveTypography.smallText);

  const reviewHistoryListStyle = {
    margin: 0,
    paddingLeft: '20px',
    color: '#2d5a87'
  };

  const reviewHistoryItemStyle = mergeResponsiveStyles({
    marginBottom: '4px'
  }, responsiveTypography.smallText);

  const reviewHistoryStatsStyle = mergeResponsiveStyles({
    color: '#4a90b8',
    textAlign: 'center' as const,
    marginTop: responsiveSpacing.buttonGap,
    fontStyle: 'italic' as const
  }, responsiveTypography.smallText);


  const formatReviewDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days since last review
  const getDaysSinceLastReview = (): { text: string; dayCount: number | null } => {
    if (!item.reviewDates || item.reviewDates.length === 0) {
      return { text: "Never reviewed before", dayCount: null };
    }

    const lastReviewDate = new Date(item.reviewDates[item.reviewDates.length - 1]);
    const today = new Date();
    const diffTime = today.getTime() - lastReviewDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: "Last reviewed today", dayCount: 0 };
    } else if (diffDays === 1) {
      return { text: "Last reviewed 1 day ago", dayCount: 1 };
    } else {
      return { text: `Last reviewed ${diffDays} days ago`, dayCount: diffDays };
    }
  };

  // Device-specific content styling
  const modalContentStyle = isMobile ? {
    flexGrow: 1,
    overflow: 'auto',
    padding: `0 ${responsiveSpacing.sectionGap}`,
    maxHeight: '60vh'
  } : {
    padding: `0 ${responsiveSpacing.sectionGap}`
  };

  const modalHeaderStyle = isMobile ? {
    flexShrink: 0,
    padding: responsiveSpacing.sectionGap,
    paddingBottom: 0
  } : {
    padding: responsiveSpacing.sectionGap,
    paddingBottom: 0
  };

  const modalFooterStyle = isMobile ? {
    flexShrink: 0,
    padding: responsiveSpacing.sectionGap,
    paddingTop: 0
  } : {
    padding: responsiveSpacing.sectionGap,
    paddingTop: 0
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

        {isMobile ? (
          // Mobile layout: structured with scrollable content
          <>
            <div style={modalHeaderStyle}>
              <h2 style={titleStyle}>Review Item</h2>
              <div style={itemNameStyle}>"{item.name}"</div>
            </div>

            <div style={modalContentStyle}>
              {item.reviewDates && item.reviewDates.length > 0 && (
                <div style={reviewHistoryStyle}>
                  <div style={reviewHistoryTitleStyle}>Review History:</div>
                  <ul style={reviewHistoryListStyle}>
                    {(() => {
                      const latestFiveDates = item.reviewDates.slice(-5); // Get last 5 dates

                      return latestFiveDates.map((date, index) => (
                        <li key={index} style={reviewHistoryItemStyle}>
                          {formatReviewDate(date)}
                        </li>
                      ));
                    })()}
                  </ul>
                  {item.reviewDates.length > 5 && (
                    <div style={reviewHistoryStatsStyle}>
                      ({item.reviewDates.length} reviews in total, well done! 🔥)
                    </div>
                  )}
                </div>
              )}

              <div style={confidenceButtonsStyle}>
                <button
                  style={confidentButtonStyle}
                  onClick={() => handleConfidenceClick('confident')}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                >
                  <span style={leftSpanStyle}>🟢 Confident</span>
                  <span style={rightSpanStyle}>Review in {settings.confidentDays} day{settings.confidentDays !== 1 ? 's' : ''}</span>
                </button>

                <button
                  style={mediumButtonStyle}
                  onClick={() => handleConfidenceClick('medium')}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                >
                  <span style={leftSpanStyle}>🔵 Medium</span>
                  <span style={rightSpanStyle}>Review in {settings.mediumDays} day{settings.mediumDays !== 1 ? 's' : ''}</span>
                </button>

                <button
                  style={wtfButtonStyle}
                  onClick={() => handleConfidenceClick('wtf')}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
                >
                  <span style={leftSpanStyle}>🔴 WTF</span>
                  <span style={rightSpanStyle}>Review in {settings.wtfDays} day{settings.wtfDays !== 1 ? 's' : ''}</span>
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
                {/* Days since last review text - same style as review history total */}
                <div style={reviewHistoryStatsStyle}>
                  {getDaysSinceLastReview().text}
                </div>
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button
                style={archiveButtonStyle}
                onClick={handleArchive}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f1a2a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a2e42'}
              >
                Archive Item
              </button>
            </div>
          </>
        ) : (
          // Desktop layout: flat structure, no scrolling
          <>
            <h2 style={titleStyle}>Review Item</h2>
            <div style={itemNameStyle}>"{item.name}"</div>

            {item.reviewDates && item.reviewDates.length > 0 && (
              <div style={reviewHistoryStyle}>
                <div style={reviewHistoryTitleStyle}>Review History:</div>
                <ul style={reviewHistoryListStyle}>
                  {(() => {
                    const latestFiveDates = item.reviewDates.slice(-5); // Get last 5 dates

                    return latestFiveDates.map((date, index) => (
                      <li key={index} style={reviewHistoryItemStyle}>
                        {formatReviewDate(date)}
                      </li>
                    ));
                  })()}
                </ul>
                {item.reviewDates.length > 5 && (
                  <div style={reviewHistoryStatsStyle}>
                    ({item.reviewDates.length} reviews in total, well done! 🔥)
                  </div>
                )}
              </div>
            )}

            <div style={confidenceButtonsStyle}>
              <button
                style={confidentButtonStyle}
                onClick={() => handleConfidenceClick('confident')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                <span style={leftSpanStyle}>🟢 Confident</span>
                <span style={rightSpanStyle}>Review in {settings.confidentDays} day{settings.confidentDays !== 1 ? 's' : ''}</span>
              </button>

              <button
                style={mediumButtonStyle}
                onClick={() => handleConfidenceClick('medium')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                <span style={leftSpanStyle}>🔵 Medium</span>
                <span style={rightSpanStyle}>Review in {settings.mediumDays} day{settings.mediumDays !== 1 ? 's' : ''}</span>
              </button>

              <button
                style={wtfButtonStyle}
                onClick={() => handleConfidenceClick('wtf')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
              >
                <span style={leftSpanStyle}>🔴 WTF</span>
                <span style={rightSpanStyle}>Review in {settings.wtfDays} day{settings.wtfDays !== 1 ? 's' : ''}</span>
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
              {/* Days since last review text - same style as review history total */}
              <div style={reviewHistoryStatsStyle}>
                {getDaysSinceLastReview().text}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
