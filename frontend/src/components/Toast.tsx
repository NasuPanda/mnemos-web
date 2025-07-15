import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  isVisible
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#059669',
          borderColor: '#047857',
          icon: '✅'
        };
      case 'error':
        return {
          backgroundColor: '#dc2626',
          borderColor: '#b91c1c',
          icon: '❌'
        };
      case 'warning':
        return {
          backgroundColor: '#d97706',
          borderColor: '#b45309',
          icon: '⚠️'
        };
      case 'info':
        return {
          backgroundColor: '#2563eb',
          borderColor: '#1d4ed8',
          icon: 'ℹ️'
        };
      default:
        return {
          backgroundColor: '#059669',
          borderColor: '#047857',
          icon: '✅'
        };
    }
  };

  const typeStyles = getTypeStyles();

  const toastStyle = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    backgroundColor: typeStyles.backgroundColor,
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `2px solid ${typeStyles.borderColor}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 2100, // Higher than confirmation dialog (1500)
    maxWidth: '400px',
    minWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
    opacity: isAnimating ? 1 : 0,
    transition: 'all 0.3s ease-in-out',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    cursor: 'pointer'
  };

  const iconStyle = {
    flexShrink: 0,
    fontSize: '16px'
  };

  const messageStyle = {
    flex: 1,
    fontWeight: '500',
    fontSize: '14px'
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '16px',
    lineHeight: 1,
    opacity: 0.8,
    transition: 'opacity 0.15s ease'
  };

  const handleClick = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  return (
    <div style={toastStyle} onClick={handleClick}>
      <span style={iconStyle}>{typeStyles.icon}</span>
      <span style={messageStyle}>{message}</span>
      <button
        style={closeButtonStyle}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

// Toast context and hook for easy usage
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default Toast;