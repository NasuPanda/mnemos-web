import React, { useState, useEffect } from 'react';
import type { AppSettings } from '../types/Settings';
import { useResponsive } from '../hooks/useBreakpoint';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { getResponsiveModalStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';
import { categoriesApi } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  allCategories: string[];
  onCategoriesUpdate: () => void;
}

type TabType = 'intervals' | 'categories';

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  allCategories,
  onCategoriesUpdate
}) => {
  // Prevent background scrolling when modal is open
  useBodyScrollLock(isOpen);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('intervals');
  
  // Review intervals state
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Categories state
  const [categories, setCategories] = useState<string[]>(allCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string>('');

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
    setErrors({});
    setActiveTab('intervals');
  }, [settings, isOpen]);

  // Update categories when prop changes
  useEffect(() => {
    setCategories(allCategories);
  }, [allCategories]);

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

  // Category management functions
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setCategoryLoading(true);
    setCategoryError('');
    
    try {
      await categoriesApi.add(newCategoryName.trim());
      setCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
      onCategoriesUpdate();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      return;
    }
    
    setCategoryLoading(true);
    setCategoryError('');
    
    try {
      await categoriesApi.delete(categoryName);
      setCategories(prev => prev.filter(cat => cat !== categoryName));
      onCategoriesUpdate();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to delete category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleStartEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName);
    setEditingCategoryName(categoryName);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditingCategoryName('');
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategory || !editingCategoryName.trim()) return;
    
    if (editingCategoryName.trim() === editingCategory) {
      handleCancelEditCategory();
      return;
    }
    
    setCategoryLoading(true);
    setCategoryError('');
    
    try {
      await categoriesApi.rename(editingCategory, editingCategoryName.trim());
      setCategories(prev => prev.map(cat => 
        cat === editingCategory ? editingCategoryName.trim() : cat
      ));
      setEditingCategory(null);
      setEditingCategoryName('');
      onCategoriesUpdate();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to rename category');
    } finally {
      setCategoryLoading(false);
    }
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

        <h2 style={titleStyle}>Settings</h2>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e8f0f5', 
          marginBottom: responsiveSpacing.sectionGap 
        }}>
          <button
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeTab === 'intervals' ? '#2d5a87' : 'transparent',
              color: activeTab === 'intervals' ? '#ffffff' : '#2d5a87',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              borderRadius: '4px 4px 0 0',
              fontWeight: activeTab === 'intervals' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('intervals')}
          >
            Review Intervals
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeTab === 'categories' ? '#2d5a87' : 'transparent',
              color: activeTab === 'categories' ? '#ffffff' : '#2d5a87',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              borderRadius: '4px 4px 0 0',
              fontWeight: activeTab === 'categories' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'intervals' && (
          <div>
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
        )}
        
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ marginBottom: '20px', fontSize: '14px', color: '#2d5a87', textAlign: 'center' }}>
              Manage your study categories. Add new categories or remove unused ones.
            </div>
            
            {categoryError && (
              <div style={{ 
                backgroundColor: '#ffebee', 
                border: '1px solid #d32f2f', 
                color: '#d32f2f', 
                padding: '10px', 
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {categoryError}
              </div>
            )}
            
            {/* Add Category Section */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Add New Category</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  style={{
                    ...inputStyle,
                    flex: 1
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCategory();
                    }
                  }}
                  disabled={categoryLoading}
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || categoryLoading}
                  style={{
                    ...saveButtonStyle,
                    width: 'auto',
                    padding: '10px 16px',
                    opacity: (!newCategoryName.trim() || categoryLoading) ? 0.5 : 1,
                    cursor: (!newCategoryName.trim() || categoryLoading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {categoryLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
            
            {/* Categories List */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Existing Categories</label>
              <div style={{ 
                maxHeight: '250px', 
                overflowY: 'auto',
                border: '1px solid #4a90b8',
                borderRadius: '4px',
                backgroundColor: '#ffffff'
              }}>
                {categories.length === 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    No categories found. Add your first category above.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #e8f0f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {editingCategory === category ? (
                        <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            style={{
                              ...inputStyle,
                              flex: 1,
                              padding: '6px 8px',
                              fontSize: '14px'
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEditCategory();
                              } else if (e.key === 'Escape') {
                                handleCancelEditCategory();
                              }
                            }}
                            autoFocus
                            disabled={categoryLoading}
                          />
                          <button
                            onClick={handleSaveEditCategory}
                            disabled={categoryLoading}
                            style={{
                              ...saveButtonStyle,
                              padding: '4px 8px',
                              fontSize: '12px',
                              width: 'auto'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditCategory}
                            disabled={categoryLoading}
                            style={{
                              ...cancelButtonStyle,
                              padding: '4px 8px',
                              fontSize: '12px',
                              width: 'auto'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span style={{ 
                            fontSize: '14px', 
                            color: '#2d5a87',
                            flex: 1
                          }}>
                            {category}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleStartEditCategory(category)}
                              disabled={categoryLoading}
                              style={{
                                ...cancelButtonStyle,
                                padding: '4px 8px',
                                fontSize: '12px',
                                width: 'auto'
                              }}
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              disabled={categoryLoading}
                              style={{
                                backgroundColor: '#d32f2f',
                                border: '1px solid #d32f2f',
                                color: '#ffffff',
                                borderRadius: '4px',
                                cursor: categoryLoading ? 'not-allowed' : 'pointer',
                                padding: '4px 8px',
                                fontSize: '12px',
                                fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                width: 'auto'
                              }}
                              onMouseOver={(e) => {
                                if (!categoryLoading) {
                                  e.currentTarget.style.backgroundColor = '#b71c1c';
                                }
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#d32f2f';
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Close Button */}
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <button
                style={cancelButtonStyle}
                onClick={onClose}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1e3f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f0f5'}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;