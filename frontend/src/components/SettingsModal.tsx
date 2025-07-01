import React, { useState, useEffect } from 'react';
import type { AppSettings } from '../types/Settings';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveModalStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
    setErrors({});
  }, [settings, isOpen]);

  const validateSettings = (data: AppSettings): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!data.confidentDays || data.confidentDays < 1 || data.confidentDays > 365) {
      newErrors.confidentDays = 'Must be between 1 and 365 days';
    }
    if (!data.mediumDays || data.mediumDays < 1 || data.mediumDays > 365) {
      newErrors.mediumDays = 'Must be between 1 and 365 days';
    }
    if (!data.wtfDays || data.wtfDays < 1 || data.wtfDays > 365) {
      newErrors.wtfDays = 'Must be between 1 and 365 days';
    }

    // Logical validation: confident should be longer than medium, medium longer than wtf
    if (data.confidentDays <= data.mediumDays) {
      newErrors.confidentDays = 'Confident interval should be longer than medium';
    }
    if (data.mediumDays <= data.wtfDays) {
      newErrors.mediumDays = 'Medium interval should be longer than WTF';
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof AppSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const newData = { ...formData, [field]: numValue };
      setFormData(newData);
      
      // Clear specific field error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleSave = () => {
    const validationErrors = validateSettings(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSaveSettings(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({ confidentDays: 7, mediumDays: 3, wtfDays: 1 });
    setErrors({});
  };

  // Responsive design integration (must be before conditional return)
  const { breakpoint } = useResponsive();
  const responsiveModal = getResponsiveModalStyles(breakpoint, 'settings');
  const responsiveTypography = getResponsiveTypography(breakpoint);
  const responsiveSpacing = getResponsiveSpacing(breakpoint);

  if (!isOpen) return null;

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
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, responsiveModal.content);

  const titleStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.sectionGap,
    textAlign: 'center' as const
  }, responsiveTypography.modalTitle);

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

  const fieldGroupStyle = {
    marginBottom: responsiveSpacing.sectionGap
  };

  const labelStyle = mergeResponsiveStyles({
    display: 'block',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap
  }, responsiveTypography.bodyText);

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#2d5a87',
    boxSizing: 'border-box' as const
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#d32f2f',
    backgroundColor: '#ffebee'
  };

  const errorTextStyle = {
    fontSize: '12px',
    color: '#d32f2f',
    marginTop: '4px'
  };

  const helperTextStyle = {
    fontSize: '12px',
    color: '#4a90b8',
    marginTop: '4px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '30px'
  };

  const resetButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#f5c842',
    border: '1px solid #f5c842',
    color: '#1e3a5f',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const cancelButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    color: '#2d5a87',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const saveButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

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

        <h2 style={titleStyle}>Review Interval Settings</h2>
        
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#2d5a87', textAlign: 'center' }}>
          Configure how many days to wait before reviewing items based on your confidence level.
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>🟢 Confident (I knew it well)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.confidentDays}
            onChange={(e) => handleInputChange('confidentDays', e.target.value)}
            style={errors.confidentDays ? errorInputStyle : inputStyle}
            placeholder="7"
          />
          {errors.confidentDays ? (
            <div style={errorTextStyle}>{errors.confidentDays}</div>
          ) : (
            <div style={helperTextStyle}>Days to wait when you're confident about the answer</div>
          )}
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>🔵 Medium (I sort of knew it)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.mediumDays}
            onChange={(e) => handleInputChange('mediumDays', e.target.value)}
            style={errors.mediumDays ? errorInputStyle : inputStyle}
            placeholder="3"
          />
          {errors.mediumDays ? (
            <div style={errorTextStyle}>{errors.mediumDays}</div>
          ) : (
            <div style={helperTextStyle}>Days to wait when you partially knew the answer</div>
          )}
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>🔴 WTF (I had no idea)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.wtfDays}
            onChange={(e) => handleInputChange('wtfDays', e.target.value)}
            style={errors.wtfDays ? errorInputStyle : inputStyle}
            placeholder="1"
          />
          {errors.wtfDays ? (
            <div style={errorTextStyle}>{errors.wtfDays}</div>
          ) : (
            <div style={helperTextStyle}>Days to wait when you didn't know the answer at all</div>
          )}
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={resetButtonStyle}
            onClick={handleReset}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7d666'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5c842'}
          >
            Reset to Default
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={cancelButtonStyle}
              onClick={onClose}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
            >
              Cancel
            </button>
            
            <button
              style={saveButtonStyle}
              onClick={handleSave}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;