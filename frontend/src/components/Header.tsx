import React from 'react';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface HeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
  onTodayClick: () => void;
  onSettingsClick: () => void;
  onDateNavigate: (direction: 'prev' | 'next') => void;
  currentDate: Date;
  categories: (string | null)[];
}

const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onCategoryChange,
  onTodayClick,
  onSettingsClick,
  onDateNavigate,
  currentDate,
  categories
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
    color: '#1e3a5f',
    margin: `0 0 ${responsiveSpacing.buttonGap} 0`,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, responsiveTypography.appTitle);

  const subtitleStyle = mergeResponsiveStyles({
    color: '#2d5a87',
    margin: '0',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, responsiveTypography.bodyText);

  return (
    <div style={containerStyle}>
      {/* Title and Subtitle - Above the header box */}
      <div style={titleSectionStyle}>
        <h1 style={titleStyle}>
          Mnemos
        </h1>
        <p style={subtitleStyle}>
          Memory & Knowledge Organization
        </p>
      </div>

      {/* Responsive Header Box */}
      {isMobile ? (
        // Mobile Layout: Two-row horizontal layout
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #4a90b8',
          borderRadius: '8px',
          padding: responsiveSpacing.containerPadding,
          marginBottom: responsiveSpacing.sectionGap,
          display: 'flex',
          flexDirection: 'column',
          gap: responsiveSpacing.buttonGap
        }}>
          {/* First Row: Today + Category + Settings (horizontal) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: responsiveSpacing.buttonGap,
            height: '48px'
          }}>
            <button
              onClick={onTodayClick}
              style={mergeResponsiveStyles({
                backgroundColor: '#2d5a87',
                border: '1px solid #2d5a87',
                color: '#ffffff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                flex: '1'
              }, getResponsiveButtonStyles(breakpoint, 'primary'))}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
            >
              Today
            </button>
            
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              style={mergeResponsiveStyles({
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                borderRadius: '4px',
                color: '#2d5a87',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                flex: '2'
              }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
            >
              {categories.map((category) => (
                <option key={category || 'all'} value={category || ''}>
                  {category || 'All Categories'}
                </option>
              ))}
            </select>
            
            <button
              onClick={onSettingsClick}
              style={mergeResponsiveStyles({
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                color: '#2d5a87',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
            >
              ⚙️
            </button>
          </div>

          {/* Second Row: Date Navigation (horizontal) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: responsiveSpacing.buttonGap,
            height: '48px'
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

            <div style={mergeResponsiveStyles({
              backgroundColor: '#e8f0f5',
              border: '1px solid #4a90b8',
              borderRadius: '4px',
              color: '#2d5a87',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textAlign: 'center',
              flex: '1'
            }, getResponsiveButtonStyles(breakpoint, 'secondary'))}>
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
              }, getResponsiveButtonStyles(breakpoint, 'secondary'))}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
            >
              →
            </button>
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
          {/* Left Section: Today Button and Category Selector */}
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

            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              style={mergeResponsiveStyles({
                backgroundColor: '#e8f0f5',
                border: '1px solid #4a90b8',
                borderRadius: '4px',
                color: '#2d5a87',
                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                minWidth: isTablet ? '120px' : '150px'
              }, isTablet ? getResponsiveButtonStyles(breakpoint, 'secondary') : { padding: '10px 14px', fontSize: '14px' })}
            >
              {categories.map((category) => (
                <option key={category || 'all'} value={category || ''}>
                  {category || 'All Categories'}
                </option>
              ))}
            </select>
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

          {/* Right Section: Settings Button */}
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
      )}
    </div>
  );
};

export default Header;