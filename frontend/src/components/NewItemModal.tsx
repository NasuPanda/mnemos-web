import React, { useState, useEffect } from 'react';
import type { StudyItem } from './ItemCard';
import { useResponsive } from '../hooks/useBreakpoint';
import { getResponsiveModalStyles, getResponsiveTypography, getResponsiveButtonStyles, getResponsiveSpacing, mergeResponsiveStyles } from '../utils/responsive';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<StudyItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'isReviewed'>) => void;
  editItem?: StudyItem | null;
  categories: string[];
  selectedCategory: string;
}

const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editItem,
  categories,
  selectedCategory
}) => {
  // Responsive design integration (must be before conditional return)
  const { breakpoint } = useResponsive();
  const responsiveModal = getResponsiveModalStyles(breakpoint, 'edit');
  const responsiveTypography = getResponsiveTypography(breakpoint);
  const responsiveSpacing = getResponsiveSpacing(breakpoint);

  const [formData, setFormData] = useState({
    name: '',
    category: selectedCategory,
    problem: '',
    answer: '',
    sideNote: '',
    problemUrl: '',
    problemImages: [] as string[],
    answerUrl: '',
    answerImages: [] as string[],
    nextReviewDate: ''
  });

  const [uploading, setUploading] = useState({
    problemImages: false,
    answerImages: false
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        category: editItem.category,
        problem: editItem.problem,
        answer: editItem.answer,
        sideNote: editItem.sideNote || '',
        problemUrl: editItem.problemUrl || '',
        problemImages: editItem.problemImages || [],
        answerUrl: editItem.answerUrl || '',
        answerImages: editItem.answerImages || [],
        nextReviewDate: editItem.nextReviewDate || ''
      });
    } else {
      setFormData({
        name: '',
        category: selectedCategory,
        problem: '',
        answer: '',
        sideNote: '',
        problemUrl: '',
        problemImages: [],
        answerUrl: '',
        answerImages: [],
        nextReviewDate: ''
      });
    }
  }, [editItem, selectedCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasLink = !!(formData.problemUrl || formData.answerUrl);
    const hasImage = !!(formData.problemImages.length || formData.answerImages.length);

    onSubmit({
      name: formData.name,
      category: formData.category,
      problem: formData.problem,
      answer: formData.answer,
      hasLink,
      hasImage,
      sideNote: formData.sideNote,
      problemUrl: formData.problemUrl,
      problemImages: formData.problemImages,
      answerUrl: formData.answerUrl,
      answerImages: formData.answerImages,
      nextReviewDate: formData.nextReviewDate || undefined
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveImage = (field: 'problemImages' | 'answerImages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleClearAllImages = (field: 'problemImages' | 'answerImages') => {
    setFormData(prev => ({
      ...prev,
      [field]: []
    }));
  };

  const handleFileUpload = async (field: 'problemImages' | 'answerImages', files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      const uploadedPaths: string[] = [];
      
      // Upload all selected files
      for (let i = 0; i < files.length; i++) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', files[i]);

        const response = await fetch('http://localhost:8000/api/upload-image', {
          method: 'POST',
          body: formDataUpload
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload response:', response.status, errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.detail || 'Upload failed');
          } catch {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
          }
        }

        const responseText = await response.text();
        const { image_path } = JSON.parse(responseText);
        uploadedPaths.push(image_path);
      }
      
      // Add new images to existing array
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...uploadedPaths]
      }));

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handlePaste = async (field: 'problemImages' | 'answerImages', event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // Create a FileList-like object with the pasted file
          const fileList = {
            0: file,
            length: 1,
            item: (index: number) => index === 0 ? file : null,
            [Symbol.iterator]: function* () { yield file; }
          } as FileList;

          await handleFileUpload(field, fileList);
        }
        break;
      }
    }
  };

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
    overflowY: 'auto' as const,
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

  const formGroupStyle = {
    marginBottom: responsiveSpacing.sectionGap
  };

  const labelStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap,
    display: 'block'
  }, responsiveTypography.bodyText);

  const inputStyle = mergeResponsiveStyles({
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    color: '#2d5a87',
    width: '100%',
    boxSizing: 'border-box' as const
  }, getResponsiveButtonStyles(breakpoint, 'secondary'));

  const textareaStyle = {
    ...inputStyle,
    height: '60px',
    resize: 'vertical' as const
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const sectionTitleStyle = mergeResponsiveStyles({
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: responsiveSpacing.buttonGap,
    marginTop: responsiveSpacing.sectionGap
  }, responsiveTypography.bodyText);

  const submitButtonStyle = mergeResponsiveStyles({
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: responsiveSpacing.sectionGap
  }, getResponsiveButtonStyles(breakpoint, 'primary'));

  const helperTextStyle = mergeResponsiveStyles({
    color: '#2d5a87',
    marginBottom: responsiveSpacing.buttonGap
  }, responsiveTypography.smallText);

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

        <h2 style={titleStyle}>
          {editItem ? 'Edit Item' : 'New Item'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Category</label>
            <select
              style={selectStyle}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div style={sectionTitleStyle}>Problem</div>
          <div style={helperTextStyle}>
            Add text, URL, and/or image for the problem. All fields are optional.
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Problem Text</label>
            <textarea
              style={textareaStyle}
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              placeholder="Enter problem text"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Problem URL</label>
            <input
              type="url"
              style={inputStyle}
              value={formData.problemUrl}
              onChange={(e) => handleInputChange('problemUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Problem Image</label>

            {/* Upload Button Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload('problemImages', e.target.files)}
                disabled={uploading.problemImages}
                style={{ display: 'none' }}
                id="problemImageUpload"
              />
              <label
                htmlFor="problemImageUpload"
                style={{
                  ...inputStyle,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: uploading.problemImages ? 'not-allowed' : 'pointer',
                  backgroundColor: uploading.problemImages ? '#f0f8ff' : '#e8f0f5',
                  padding: '10px 15px',
                  width: 'auto',
                  fontSize: '12px'
                }}
              >
                📎 Select Image Files
              </label>
            </div>

            {/* Paste Area Section */}
            <div
              style={{
                ...inputStyle,
                minHeight: '50px',
                border: '2px dashed #4a90b8',
                backgroundColor: '#f8fcff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'text',
                marginBottom: responsiveSpacing.buttonGap
              }}
              onPaste={(e) => handlePaste('problemImages', e)}
              tabIndex={0}
            >
              <div style={mergeResponsiveStyles({ color: '#2d5a87', textAlign: 'center' }, responsiveTypography.smallText)}>
                📋 Paste Image Here (Cmd+V)
              </div>
            </div>

            {/* Images Display Section */}
            {formData.problemImages.length > 0 && (
              <div style={{
                ...inputStyle,
                backgroundColor: '#f8fcff',
                padding: '8px 12px',
                marginBottom: '8px'
              }}>
                <div style={mergeResponsiveStyles({ color: '#2d5a87', marginBottom: responsiveSpacing.buttonGap }, responsiveTypography.smallText)}>
                  Uploaded Images:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {formData.problemImages.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#e8f0f5',
                        border: '1px solid #4a90b8',
                        borderRadius: '3px',
                        padding: '3px 6px',
                        fontSize: '10px'
                      }}
                    >
                      <span>🖼️ Image {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('problemImages', index)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#2d5a87',
                          cursor: 'pointer',
                          marginLeft: '5px',
                          fontSize: '10px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Section */}
            <div style={{
              ...inputStyle,
              backgroundColor: '#f5f9fc',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#2d5a87'
            }}>
              {uploading.problemImages ? (
                <span>🔄 Uploading...</span>
              ) : formData.problemImages.length > 0 ? (
                <>
                  <span>✅ {formData.problemImages.length} image{formData.problemImages.length > 1 ? 's' : ''} ready</span>
                  <button
                    type="button"
                    onClick={() => handleClearAllImages('problemImages')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#2d5a87',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear All
                  </button>
                </>
              ) : (
                <span>No images selected</span>
              )}
            </div>
          </div>

          <div style={sectionTitleStyle}>Answer</div>
          <div style={helperTextStyle}>
            Add text, URL, and/or image for the answer. All fields are optional.
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Answer Text</label>
            <textarea
              style={textareaStyle}
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              placeholder="Enter answer text"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Answer URL</label>
            <input
              type="url"
              style={inputStyle}
              value={formData.answerUrl}
              onChange={(e) => handleInputChange('answerUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Answer Image</label>

            {/* Upload Button Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload('answerImages', e.target.files)}
                disabled={uploading.answerImages}
                style={{ display: 'none' }}
                id="answerImageUpload"
              />
              <label
                htmlFor="answerImageUpload"
                style={{
                  ...inputStyle,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: uploading.answerImages ? 'not-allowed' : 'pointer',
                  backgroundColor: uploading.answerImages ? '#f0f8ff' : '#e8f0f5',
                  padding: '10px 15px',
                  width: 'auto',
                  fontSize: '12px'
                }}
              >
                📎 Select Image Files
              </label>
            </div>

            {/* Paste Area Section */}
            <div
              style={{
                ...inputStyle,
                minHeight: '50px',
                border: '2px dashed #4a90b8',
                backgroundColor: '#f8fcff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'text',
                marginBottom: responsiveSpacing.buttonGap
              }}
              onPaste={(e) => handlePaste('answerImages', e)}
              tabIndex={0}
            >
              <div style={mergeResponsiveStyles({ color: '#2d5a87', textAlign: 'center' }, responsiveTypography.smallText)}>
                📋 Paste Image Here (Cmd+V)
              </div>
            </div>

            {/* Images Display Section */}
            {formData.answerImages.length > 0 && (
              <div style={{
                ...inputStyle,
                backgroundColor: '#f8fcff',
                padding: '8px 12px',
                marginBottom: '8px'
              }}>
                <div style={mergeResponsiveStyles({ color: '#2d5a87', marginBottom: responsiveSpacing.buttonGap }, responsiveTypography.smallText)}>
                  Uploaded Images:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {formData.answerImages.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#e8f0f5',
                        border: '1px solid #4a90b8',
                        borderRadius: '3px',
                        padding: '3px 6px',
                        fontSize: '10px'
                      }}
                    >
                      <span>🖼️ Image {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('answerImages', index)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#2d5a87',
                          cursor: 'pointer',
                          marginLeft: '5px',
                          fontSize: '10px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Section */}
            <div style={{
              ...inputStyle,
              backgroundColor: '#f5f9fc',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#2d5a87'
            }}>
              {uploading.answerImages ? (
                <span>🔄 Uploading...</span>
              ) : formData.answerImages.length > 0 ? (
                <>
                  <span>✅ {formData.answerImages.length} image{formData.answerImages.length > 1 ? 's' : ''} ready</span>
                  <button
                    type="button"
                    onClick={() => handleClearAllImages('answerImages')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#2d5a87',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear All
                  </button>
                </>
              ) : (
                <span>No images selected</span>
              )}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Side Note</label>
            <textarea
              style={textareaStyle}
              value={formData.sideNote}
              onChange={(e) => handleInputChange('sideNote', e.target.value)}
              placeholder="Additional notes or comments"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Next Review Date</label>
            <input
              type="date"
              style={inputStyle}
              value={formData.nextReviewDate}
              onChange={(e) => handleInputChange('nextReviewDate', e.target.value)}
            />
            <div style={helperTextStyle}>
              Set when this item should be reviewed next. Leave empty for new items to show on all dates.
            </div>
          </div>

          <button
            type="submit"
            style={submitButtonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#245073'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5a87'}
          >
            {editItem ? 'Update Item' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewItemModal;
