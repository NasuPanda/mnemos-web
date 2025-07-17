import React from 'react';
import ItemCard, { type StudyItem } from './ItemCard';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveSpacing, getResponsiveTypography, mergeResponsiveStyles } from '../utils/responsive';

interface ItemGridProps {
  items: StudyItem[];
  categoryName: string;
  onShowAnswer: (item: StudyItem) => void;
  onEdit: (item: StudyItem) => void;
  onDelete: (item: StudyItem) => void;
  onDoubleClick: (item: StudyItem) => void;
  onReview: (item: StudyItem) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  categoryName,
  onShowAnswer,
  onEdit,
  onDelete,
  onDoubleClick,
  onReview
}) => {
  // Responsive design integration
  const { breakpoint, isMobile, isTablet, isDesktopOrWide } = useResponsive();
  const responsiveSpacing = getResponsiveSpacing(breakpoint);
  const responsiveTypography = getResponsiveTypography(breakpoint);
  // Sort items: unreviewed first, then by date (most recent last)
  const sortedItems = [...items].sort((a, b) => {
    // Primary sort: unreviewed items first
    if (a.isReviewed !== b.isReviewed) {
      return a.isReviewed ? 1 : -1;
    }
    
    // Secondary sort: by date (oldest first within each review status)
    const dateA = new Date(a.lastAccessedAt || a.createdAt).getTime();
    const dateB = new Date(b.lastAccessedAt || b.createdAt).getTime();
    return dateA - dateB;
  });

  if (sortedItems.length === 0) {
    return null;
  }

  const containerStyle = {
    marginBottom: responsiveSpacing.sectionGap
  };

  const headerStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, responsiveTypography.modalTitle);

  // Responsive grid layout based on breakpoint
  const getGridStyle = () => {
    const baseStyle = {
      fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    };

    if (isMobile) {
      // Mobile: Vertical stack
      return {
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: responsiveSpacing.cardGap,
        overflowX: 'visible' as const,
        overflowY: 'visible' as const
      };
    }

    if (isTablet) {
      // Tablet: CSS Grid
      return {
        ...baseStyle,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: responsiveSpacing.cardGap,
        overflowX: 'visible' as const,
        overflowY: 'visible' as const
      };
    }

    // Desktop/Wide: Current horizontal scroll
    return {
      ...baseStyle,
      display: 'flex',
      alignItems: 'flex-start',
      gap: responsiveSpacing.cardGap,
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      padding: '10px 0',
      paddingBottom: '20px',
      minHeight: 'fit-content'
    };
  };

  const gridStyle = getGridStyle();

  // Only apply scrollbar styles for desktop/wide screens
  const scrollbarStyle = isDesktopOrWide ? `
    .item-grid-scroll::-webkit-scrollbar {
      height: 8px;
    }
    .item-grid-scroll::-webkit-scrollbar-track {
      background-color: #e8f0f5;
      border: 1px solid #4a90b8;
      border-radius: 4px;
    }
    .item-grid-scroll::-webkit-scrollbar-thumb {
      background-color: #2d5a87;
      border-radius: 4px;
    }
  ` : '';

  return (
    <>
      <style>{scrollbarStyle}</style>
      <div style={containerStyle}>
        <h2 style={headerStyle}>
          {categoryName}
        </h2>
        <div style={gridStyle} className={isDesktopOrWide ? "item-grid-scroll" : ""}>
          {sortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onShowAnswer={onShowAnswer}
              onEdit={onEdit}
              onDelete={onDelete}
              onDoubleClick={onDoubleClick}
              onReview={onReview}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemGrid;