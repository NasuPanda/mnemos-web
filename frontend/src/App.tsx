import { useState } from 'react';
import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import NewItemModal from './components/NewItemModal';
import ReviewModal from './components/ReviewModal';
import ShowAnswerModal from './components/ShowAnswerModal';
import type { StudyItem } from './components/ItemCard';

// Dummy data for testing
const DUMMY_ITEMS: StudyItem[] = [
  {
    id: '1',
    name: 'Derivatives',
    problem: 'What is the derivative of x^2 + 3x + 1?',
    answer: '2x + 3',
    category: 'Calculus 1',
    createdAt: '2024-06-25',
    isReviewed: false,
    hasLink: true,
    hasImage: false
  },
  {
    id: '2',
    name: 'Ephemeral',
    problem: 'What does ephemeral mean?',
    answer: 'Lasting for a very short time',
    category: 'Vocabulary',
    createdAt: '2024-06-26',
    isReviewed: true,
    hasLink: false,
    hasImage: true
  },
  {
    id: '3',
    name: 'World War II',
    problem: 'When did World War II end?',
    answer: 'September 2, 1945',
    category: 'History',
    createdAt: '2024-06-27',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '4',
    name: 'Integration',
    problem: 'What is the integral of 2x?',
    answer: 'x^2 + C',
    category: 'Calculus 1',
    createdAt: '2024-06-24',
    isReviewed: true,
    hasLink: false,
    hasImage: false
  }
];

function App() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<StudyItem[]>(DUMMY_ITEMS);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShowAnswerModalOpen, setIsShowAnswerModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);
  const [editingItem, setEditingItem] = useState<StudyItem | null>(null);

  // Get unique categories from items
  const actualCategories = Array.from(new Set(items.map(item => item.category)));
  const categories = [null, ...actualCategories];

  // Filter items by category
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory)
    : items;

  // Group items by category for display
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, StudyItem[]>);


  const handleCategoryChange = (categoryValue: string) => {
    // Convert empty string back to null for "All Categories"
    setSelectedCategory(categoryValue === '' ? null : categoryValue);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleDateNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleShowAnswer = (item: StudyItem) => {
    setSelectedItem(item);
    setIsShowAnswerModalOpen(true);
  };

  const handleEdit = (item: StudyItem) => {
    setEditingItem(item);
    setIsNewItemModalOpen(true);
  };

  const handleDelete = (item: StudyItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleDoubleClick = (item: StudyItem) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const handleNewItem = (newItemData: Omit<StudyItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'isReviewed'>) => {
    if (editingItem) {
      // Update existing item
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...newItemData }
          : item
      ));
      setEditingItem(null);
    } else {
      // Create new item
      const newItem: StudyItem = {
        ...newItemData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        isReviewed: false
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  const handleReview = (itemId: string, reviewType: 'confident' | 'medium' | 'wtf' | 'custom', customDays?: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isReviewed: true, lastAccessedAt: new Date().toISOString().split('T')[0] }
        : item
    ));
    console.log(`Item ${itemId} reviewed with ${reviewType}${customDays ? ` for ${customDays} days` : ''}`);
  };

  const handleArchive = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    console.log(`Item ${itemId} archived`);
  };

  const handleCloseModals = () => {
    setIsNewItemModalOpen(false);
    setIsReviewModalOpen(false);
    setIsShowAnswerModalOpen(false);
    setSelectedItem(null);
    setEditingItem(null);
  };

  return (
    <div style={{ backgroundColor: '#e8f0f5', minHeight: '100vh' }}>
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onTodayClick={handleTodayClick}
        onSettingsClick={handleSettingsClick}
        onDateNavigate={handleDateNavigate}
        currentDate={currentDate}
        categories={categories}
      />
      
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={() => setIsNewItemModalOpen(true)}
          style={{
            backgroundColor: '#2d5a87',
            border: '1px solid #2d5a87',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >
          + New Item
        </button>

        {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
          <ItemGrid
            key={categoryName}
            items={categoryItems}
            categoryName={categoryName}
            onShowAnswer={handleShowAnswer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDoubleClick={handleDoubleClick}
          />
        ))}
      </div>

      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleNewItem}
        editItem={editingItem}
        categories={actualCategories}
        selectedCategory={selectedCategory || actualCategories[0] || 'Default'}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseModals}
        onReview={handleReview}
        onArchive={handleArchive}
        item={selectedItem}
      />

      <ShowAnswerModal
        isOpen={isShowAnswerModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />
    </div>
  );
}

export default App;
