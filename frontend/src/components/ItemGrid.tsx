import React from 'react';
import ItemCard, { type StudyItem } from './ItemCard';

interface ItemGridProps {
  items: StudyItem[];
  categoryName: string;
  onShowAnswer: (item: StudyItem) => void;
  onEdit: (item: StudyItem) => void;
  onDelete: (item: StudyItem) => void;
  onDoubleClick: (item: StudyItem) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  categoryName,
  onShowAnswer,
  onEdit,
  onDelete,
  onDoubleClick
}) => {
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
    marginBottom: '30px'
  };

  const headerStyle = {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '10px',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const gridStyle = {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    padding: '10px 0',
    paddingBottom: '20px'
  };

  const scrollbarStyle = `
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
  `;

  return (
    <>
      <style>{scrollbarStyle}</style>
      <div style={containerStyle}>
        <h2 style={headerStyle}>
          {categoryName}
        </h2>
        <div style={gridStyle} className="item-grid-scroll">
          {sortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onShowAnswer={onShowAnswer}
              onEdit={onEdit}
              onDelete={onDelete}
              onDoubleClick={onDoubleClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemGrid;