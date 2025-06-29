import React from 'react';


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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{ backgroundColor: '#e8f0f5', padding: '20px' }}>
      {/* Title and Subtitle - Above the header box */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1e3a5f',
          margin: '0 0 5px 0',
          fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Mnemos
        </h1>
        <p style={{ 
          fontSize: '12px', 
          color: '#2d5a87',
          margin: '0',
          fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Memory & Knowledge Organization
        </p>
      </div>

      {/* Header Box */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #4a90b8',
        borderRadius: '8px',
        height: '60px',
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
          {/* Today Button */}
          <button
            onClick={onTodayClick}
            style={{
              backgroundColor: '#2d5a87',
              border: '1px solid #2d5a87',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
          >
            Today
          </button>

          {/* Category Selector */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{
              backgroundColor: '#e8f0f5',
              border: '1px solid #4a90b8',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#2d5a87',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              minWidth: '120px'
            }}
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
          {/* Previous Date */}
          <button
            onClick={() => onDateNavigate('prev')}
            style={{
              backgroundColor: '#4a90b8',
              border: '1px solid #4a90b8',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
          >
            ←
          </button>

          {/* Current Date */}
          <div style={{
            backgroundColor: '#e8f0f5',
            border: '1px solid #4a90b8',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#2d5a87',
            fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            minWidth: '160px',
            textAlign: 'center'
          }}>
            {formatDate(currentDate)}
          </div>

          {/* Next Date */}
          <button
            onClick={() => onDateNavigate('next')}
            style={{
              backgroundColor: '#4a90b8',
              border: '1px solid #4a90b8',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a7a9d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90b8'}
          >
            →
          </button>
        </div>

        {/* Right Section: Settings Button */}
        <button
          onClick={onSettingsClick}
          style={{
            backgroundColor: '#e8f0f5',
            border: '1px solid #4a90b8',
            color: '#2d5a87',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default Header;