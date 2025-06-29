import React, { useState, useEffect } from 'react';
import type { StudyItem } from './ItemCard';

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
  const [formData, setFormData] = useState({
    name: '',
    category: selectedCategory,
    problem: '',
    answer: '',
    sideNote: '',
    problemUrl: '',
    problemImage: '',
    answerUrl: '',
    answerImage: ''
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        category: editItem.category,
        problem: editItem.problem,
        answer: editItem.answer,
        sideNote: '',
        problemUrl: '',
        problemImage: '',
        answerUrl: '',
        answerImage: ''
      });
    } else {
      setFormData({
        name: '',
        category: selectedCategory,
        problem: '',
        answer: '',
        sideNote: '',
        problemUrl: '',
        problemImage: '',
        answerUrl: '',
        answerImage: ''
      });
    }
  }, [editItem, selectedCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasLink = !!(formData.problemUrl || formData.answerUrl);
    const hasImage = !!(formData.problemImage || formData.answerImage);
    
    onSubmit({
      name: formData.name,
      category: formData.category,
      problem: formData.problem,
      answer: formData.answer,
      hasLink,
      hasImage
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  const overlayStyle = {
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
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    border: '3px solid #4a90b8',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative' as const,
    width: '640px',
    height: '540px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '20px',
    textAlign: 'center' as const
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#2d5a87',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '5px',
    display: 'block'
  };

  const inputStyle = {
    backgroundColor: '#e8f0f5',
    border: '1px solid #4a90b8',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2d5a87',
    width: '100%',
    boxSizing: 'border-box' as const
  };

  const textareaStyle = {
    ...inputStyle,
    height: '60px',
    resize: 'vertical' as const
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#1e3a5f',
    marginBottom: '10px',
    marginTop: '20px'
  };

  const submitButtonStyle = {
    backgroundColor: '#2d5a87',
    border: '1px solid #2d5a87',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px'
  };

  const helperTextStyle = {
    fontSize: '11px',
    color: '#2d5a87',
    marginBottom: '10px'
  };

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
            <label style={labelStyle}>Problem Image URL</label>
            <input
              type="url"
              style={inputStyle}
              value={formData.problemImage}
              onChange={(e) => handleInputChange('problemImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
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
            <label style={labelStyle}>Answer Image URL</label>
            <input
              type="url"
              style={inputStyle}
              value={formData.answerImage}
              onChange={(e) => handleInputChange('answerImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
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