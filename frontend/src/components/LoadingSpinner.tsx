import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  type?: 'normal' | 'service-starting';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  submessage,
  type = 'normal'
}) => {
  const spinnerColor = type === 'service-starting' ? '#f39c12' : '#2d5a87';
  const borderColor = type === 'service-starting' ? '#f39c12' : '#2d5a87';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      minHeight: '200px'
    }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: `4px solid #f3f3f3`,
          borderTop: `4px solid ${borderColor}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}
      />
      
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: spinnerColor,
        marginBottom: '8px',
        fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        {message}
      </div>
      
      {submessage && (
        <div style={{
          fontSize: '14px',
          color: '#666',
          maxWidth: '300px',
          lineHeight: '1.4',
          fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          {submessage}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;