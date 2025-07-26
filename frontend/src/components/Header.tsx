import React from 'react';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface HeaderProps {
  onTodayClick: () => void;
  onSettingsClick: () => void;
  onDateNavigate: (direction: 'prev' | 'next') => void;
  currentDate: Date;
  stats: { total: number; reviewed: number };
}

const Header: React.FC<HeaderProps> = ({
  onTodayClick,
  onSettingsClick,
  onDateNavigate,
  currentDate,
  stats
}) => {
  // Responsive design integration
  const { breakpoint, isMobile, isTablet } = useResponsive();
  const responsiveTypography = getResponsiveTypography(breakpoint);
  const responsiveSpacing = getResponsiveSpacing(breakpoint);

  const formatDate = (date: Date) => {
    // Shorter format on mobile to save space
    if (isMobile) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Responsive styles
  const containerStyle = {
    backgroundColor: '#e8f0f5',
    padding: responsiveSpacing.containerPadding
  };

  const titleSectionStyle = {
    textAlign: 'center' as const,
    marginBottom: responsiveSpacing.buttonGap
  };

  const titleStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#2d5a87',
    margin: '0',
    fontFamily: 'Playfair Display',
    display: 'inline'
  }, responsiveTypography.appTitle);

  const subtitleStyle = mergeResponsiveStyles({
    color: '#4a90b8',
    margin: '0',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: '300' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontSize: isMobile ? '6px' : '10px',
    display: 'inline',
    marginLeft: '8px'
  }, responsiveTypography.smallText);

  return (
    <div style={containerStyle}>
      {/* Title and Subtitle - Above the header box */}
      <div style={titleSectionStyle}>
        <h1 style={titleStyle}>
          Mnemos
        </h1>
        <span style={subtitleStyle}>
          Memory & Knowledge Organization
        </span>
      </div>

      {/* Responsive Header Box */}
      {isMobile ? (
        // Mobile Layout: Two-row layout with grouped controls and centered status
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #4a90b8',
          borderRadius: '8px',
          padding: responsiveSpacing.containerPadding,
          marginBottom: responsiveSpacing.sectionGap,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Top Row: Navigation Controls (left) + Settings (right) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '36px'
          }}>
            {/* Left: Navigation group */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => onDateNavigate('prev')}
                style={mergeResponsiveStyles({
                  backgroundColor: '#4a90b8',
                  border: '1px solid #4a90b8',
                  color: '#ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
              >
                ←
              </button>

              <button
                onClick={onTodayClick}
                style={mergeResponsiveStyles({
                  backgroundColor: '#2d5a87',
                  border: '1px solid #2d5a87',
                  color: '#ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }, getResponsiveButtonStyles(breakpoint, 'primary'))}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
              >
                Today
              </button>

              <button
                onClick={() => onDateNavigate('next')}
                style={mergeResponsiveStyles({
                  backgroundColor: '#4a90b8',
                  border: '1px solid #4a90b8',
                  color: '#ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
              >
                →
              </button>
            </div>

            {/* Right: Settings */}
            <button
              onClick={onSettingsClick}
              style={mergeResponsiveStyles({
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                color: '#2d5a87',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '16px'
              }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
            >
              ⚙️
            </button>
          </div>

          {/* Subtle Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#d1e3f0',
            margin: '0 -15px'
          }} />

          {/* Bottom Row: Date and Stats (centered) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: '28px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#2d5a87',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}>
              {formatDate(currentDate)}
            </div>
            {stats.total > 0 && (
              <div style={{
                fontSize: '12px',
                color: '#4a90b8',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                ✓ {stats.reviewed}/{stats.total}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Tablet/Desktop Layout: Horizontal (Current Implementation Enhanced)
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #4a90b8',
          borderRadius: '8px',
          height: '70px',
          padding: '0 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Left Section: Today Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={onTodayClick}
              style={mergeResponsiveStyles({
                backgroundColor: '#2d5a87',
                border: '1px solid #2d5a87',
                color: '#ffffff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }, isTablet ? getResponsiveButtonStyles(breakpoint, 'primary') : { padding: '8px 14px', fontSize: '14px' })}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
            >
              Today
            </button>
          </div>

          {/* Center Section: Date Navigation */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button
              onClick={() => onDateNavigate('prev')}
              style={mergeResponsiveStyles({
                backgroundColor: '#4a90b8',
                border: '1px solid #4a90b8',
                color: '#ffffff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }, isTablet ? getResponsiveButtonStyles(breakpoint, 'secondary') : { padding: '6px 10px', fontSize: '14px' })}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
            >
              ←
            </button>

            <div style={{
              backgroundColor: '#e8f0f5',
              border: '1px solid #4a90b8',
              borderRadius: '4px',
              padding: isTablet ? '8px 12px' : '10px 14px',
              fontSize: isTablet ? '13px' : '14px',
              color: '#2d5a87',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              minWidth: isTablet ? '160px' : '180px',
              textAlign: 'center'
            }}>
              {formatDate(currentDate)}
            </div>

            <button
              onClick={() => onDateNavigate('next')}
              style={mergeResponsiveStyles({
                backgroundColor: '#4a90b8',
                border: '1px solid #4a90b8',
                color: '#ffffff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }, isTablet ? getResponsiveButtonStyles(breakpoint, 'secondary') : { padding: '6px 10px', fontSize: '14px' })}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
            >
              →
            </button>
          </div>

          {/* Right Section: Stats and Settings Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {stats.total > 0 && (
              <div style={{
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                borderRadius: '4px',
                padding: isTablet ? '6px 10px' : '8px 12px',
                fontSize: isTablet ? '12px' : '13px',
                color: '#2d5a87',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                ✓ {stats.reviewed}/{stats.total}
              </div>
            )}

            <button
              onClick={onSettingsClick}
              style={mergeResponsiveStyles({
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                color: '#2d5a87',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }, isTablet ? getResponsiveButtonStyles(breakpoint, 'small') : { padding: '6px 12px', fontSize: '12px' })}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
            >
              ⚙️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
