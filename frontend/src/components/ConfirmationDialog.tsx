import React from 'react';
import { useResponsive } from '../hooks/useBreakpoint';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { getResponsiveModalStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);
  
  const breakpoint = useResponsive();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  // Responsive modal styles
  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
    padding: '16px'
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    maxWidth: '420px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center' as const
  };

  const titleStyle = {
    margin: 0,
    color: type === 'danger' ? '#dc2626' : type === 'warning' ? '#d97706' : '#1f2937',
    fontWeight: '600',
    fontSize: '18px'
  };

  const messageStyle = {
    padding: '20px',
    color: '#4b5563',
    textAlign: 'center' as const,
    lineHeight: '1.6',
    fontSize: '14px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    paddingTop: 0,
    justifyContent: 'center'
  };

  const cancelButtonStyle = {
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const confirmButtonStyle = {
    backgroundColor: type === 'danger' ? '#dc2626' : '#1a2e42',
    border: '1px solid transparent',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px'
  };

  return (
    <div style={modalOverlayStyle} onClick={handleBackdropClick}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
        </div>
        
        <div style={messageStyle}>
          {message}
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            {cancelText}
          </button>
          <button
            style={confirmButtonStyle}
            onClick={handleConfirmClick}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = type === 'danger' ? '#b91c1c' : '#0f1a2a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = type === 'danger' ? '#dc2626' : '#1a2e42';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;