import { useState, useEffect } from 'react';
import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import NewItemModal from './components/NewItemModal';
import ReviewModal from './components/ReviewModal';
import ShowAnswerModal from './components/ShowAnswerModal';
import SettingsModal from './components/SettingsModal';
import type { StudyItem } from './components/ItemCard';
import type { AppSettings } from './types/Settings';
import { DEFAULT_SETTINGS } from './types/Settings';
import { itemsApi, settingsApi, categoriesApi } from './services/api';


// Dummy data for testing date-based filtering - COMMENTED OUT FOR API INTEGRATION
/*
const DUMMY_ITEMS: StudyItem[] = [
  {
    id: '1',
    name: 'Complete Test Item with All Fields',
    problem: 'This is the main problem text that appears on the card. What is the derivative of x^2 + 3x + 1?',
    answer: 'The derivative is 2x + 3\n\nDetailed explanation: https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules\n\nAdditional reference: https://mathworld.wolfram.com/Derivative.html',
    category: 'Calculus 1',
    createdAt: '2024-06-25',
    isReviewed: false,
    hasLink: true,
    hasImage: true,
    
    // Review system - unreviewed item (shows on all dates)
    nextReviewDate: undefined,
    reviewDates: [],
    
    // Extended fields with all possible content
    sideNote: 'This is a side note that provides additional context or personal thoughts about this item.',
    problemUrl: 'https://www.wolframalpha.com/input/?i=derivative+of+x%5E2%2B3x%2B1',
    problemImages: ['http://localhost:8000/images/1d759c84-2981-4abc-afd7-1f4970f068cb.jpeg', 'http://localhost:8000/images/4489e6f2-18a4-46e0-a8d4-f68519b11e3c.png'],
    answerUrl: 'https://tutorial.math.lamar.edu/classes/calci/defnofderivative.aspx',
    answerImages: ['http://localhost:8000/images/84178fd6-e79d-49f3-93c4-d5ca69ed4014.jpeg']
  },
  {
    id: '2',
    name: 'Ephemeral',
    problem: 'What does ephemeral mean?',
    answer: 'Lasting for a very short time\n\nhttps://www.merriam-webster.com/dictionary/ephemeral',
    category: 'Vocabulary',
    createdAt: '2024-06-26',
    isReviewed: true,
    hasLink: false,
    hasImage: true,
    
    // Review system - due today
    nextReviewDate: getTodayString(),
    reviewDates: ['2024-06-26']
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
    hasImage: false,
    
    // Review system - new unreviewed item (shows on all dates)
    nextReviewDate: undefined,
    reviewDates: []
  },
  {
    id: '4',
    name: 'Integration',
    problem: 'What is the integral of 2x?',
    answer: 'x^2 + C\n\nReference: https://mathworld.wolfram.com/Integral.html',
    category: 'Calculus 1',
    createdAt: '2024-06-24',
    isReviewed: true,
    hasLink: false,
    hasImage: true,
    
    // Review system - due tomorrow
    nextReviewDate: getTomorrowString(),
    reviewDates: ['2024-06-24', '2024-06-27'],
    
    problemImages: ['http://localhost:8000/images/b570bda5-0275-4562-a21f-554402d7d9f2.jpeg'],
    answerImages: ['http://localhost:8000/images/d4098a6b-bf60-469a-9f92-6718ff980218.png']
  },
  {
    id: '5',
    name: 'Python List Comprehension',
    problem: 'How do you create a list of squares from 1 to 10?',
    answer: '[x**2 for x in range(1, 11)]',
    category: 'Programming',
    createdAt: '2024-06-28',
    isReviewed: true,
    hasLink: false,
    hasImage: false,
    
    // Review system - was due yesterday (won't show unless user navigates to yesterday)
    nextReviewDate: getYesterdayString(),
    reviewDates: ['2024-06-28']
  },
  // Additional Vocabulary items for testing horizontal scroll
  {
    id: '6',
    name: 'Ubiquitous',
    problem: 'What does ubiquitous mean?',
    answer: 'Present, appearing, or found everywhere',
    category: 'Vocabulary',
    createdAt: '2024-06-25',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '7',
    name: 'Serendipity',
    problem: 'Define serendipity',
    answer: 'The occurrence of events by chance in a happy or beneficial way',
    category: 'Vocabulary',
    createdAt: '2024-06-26',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '8',
    name: 'Mellifluous',
    problem: 'What does mellifluous mean?',
    answer: 'Sweet or musical; pleasant to hear',
    category: 'Vocabulary',
    createdAt: '2024-06-27',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '9',
    name: 'Perspicacious',
    problem: 'Define perspicacious',
    answer: 'Having a ready insight into and understanding of things',
    category: 'Vocabulary',
    createdAt: '2024-06-28',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '10',
    name: 'Quixotic',
    problem: 'What does quixotic mean?',
    answer: 'Extremely idealistic; unrealistic and impractical',
    category: 'Vocabulary',
    createdAt: '2024-06-29',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '11',
    name: 'Surreptitious',
    problem: 'Define surreptitious',
    answer: 'Kept secret, especially because it would not be approved of',
    category: 'Vocabulary',
    createdAt: '2024-06-25',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '12',
    name: 'Vicarious',
    problem: 'What does vicarious mean?',
    answer: 'Experienced in the imagination through the feelings or actions of another person',
    category: 'Vocabulary',
    createdAt: '2024-06-26',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '13',
    name: 'Zeitgeist',
    problem: 'Define zeitgeist',
    answer: 'The defining spirit or mood of a particular period of history',
    category: 'Vocabulary',
    createdAt: '2024-06-27',
    isReviewed: false,
    hasImage: false
  },
  {
    id: '14',
    name: 'Cacophony',
    problem: 'What does cacophony mean?',
    answer: 'A harsh, discordant mixture of sounds',
    category: 'Vocabulary',
    createdAt: '2024-06-28',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '15',
    name: 'Enigmatic',
    problem: 'Define enigmatic',
    answer: 'Difficult to interpret or understand; mysterious',
    category: 'Vocabulary',
    createdAt: '2024-06-29',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '16',
    name: 'Fastidious',
    problem: 'What does fastidious mean?',
    answer: 'Very attentive to and concerned about accuracy and detail',
    category: 'Vocabulary',
    createdAt: '2024-06-25',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '17',
    name: 'Gregarious',
    problem: 'Define gregarious',
    answer: 'Fond of the company of others; sociable',
    category: 'Vocabulary',
    createdAt: '2024-06-26',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '18',
    name: 'Indelible',
    problem: 'What does indelible mean?',
    answer: 'Making marks that cannot be removed; not able to be forgotten',
    category: 'Vocabulary',
    createdAt: '2024-06-27',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '19',
    name: 'Juxtaposition',
    problem: 'Define juxtaposition',
    answer: 'The fact of two things being seen or placed close together with contrasting effect',
    category: 'Vocabulary',
    createdAt: '2024-06-28',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  },
  {
    id: '20',
    name: 'Lackadaisical',
    problem: 'What does lackadaisical mean?',
    answer: 'Lacking enthusiasm and determination; carelessly lazy',
    category: 'Vocabulary',
    createdAt: '2024-06-29',
    isReviewed: false,
    hasLink: false,
    hasImage: false
  }
];
*/

function App() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShowAnswerModalOpen, setIsShowAnswerModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);
  const [editingItem, setEditingItem] = useState<StudyItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, settingsData, categoriesData] = await Promise.all([
        itemsApi.getAll(),
        settingsApi.get(),
        categoriesApi.getAll()
      ]);
      setItems(itemsData);
      setSettings(settingsData);
      setAllCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to default settings if API fails
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  // Use predefined categories from backend for default selection (no filtering)
  const categories = allCategories;

  // Helper function to format date for comparison (YYYY-MM-DD)
  const formatDateForComparison = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to check if item should be shown on current date
  const shouldShowItemOnDate = (item: StudyItem, displayDate: Date): boolean => {
    const dateString = formatDateForComparison(displayDate);
    
    // If item has a specific next review date, check if it matches
    if (item.nextReviewDate) {
      return item.nextReviewDate === dateString;
    }
    
    // If item is unreviewed and has no review date, show it (new items)
    if (!item.isReviewed) {
      return true;
    }
    
    // Reviewed items without a next review date are not shown
    return false;
  };

  // Filter items by date only (no category filtering)
  const filteredItems = items.filter(item => 
    shouldShowItemOnDate(item, currentDate)
  );

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
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    try {
      const updatedSettings = await settingsApi.update(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Optionally show error message to user
    }
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

  const handleDelete = async (item: StudyItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await itemsApi.delete(item.id);
        setItems(prev => prev.filter(i => i.id !== item.id));
      } catch (error) {
        console.error('Failed to delete item:', error);
        // Optionally show error message to user
      }
    }
  };

  const handleDoubleClick = (item: StudyItem) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  const handleNewItem = async (newItemData: Omit<StudyItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'isReviewed'>) => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await itemsApi.update(editingItem.id, { ...editingItem, ...newItemData });
        setItems(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        setEditingItem(null);
      } else {
        // Create new item
        const newItem = await itemsApi.create(newItemData);
        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      // Optionally show error message to user
    }
  };

  const handleReview = async (itemId: string, reviewType: 'confident' | 'medium' | 'wtf' | 'custom', customDays?: number) => {
    // Calculate days based on review type using settings
    let daysToAdd: number;
    switch (reviewType) {
      case 'confident':
        daysToAdd = settings.confidentDays;
        break;
      case 'medium':
        daysToAdd = settings.mediumDays;
        break;
      case 'wtf':
        daysToAdd = settings.wtfDays;
        break;
      case 'custom':
        daysToAdd = customDays || settings.wtfDays;
        break;
      default:
        daysToAdd = 1;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
    const nextReviewDateString = nextReviewDate.toISOString().split('T')[0];

    // Current date for review history
    const currentDateString = new Date().toISOString().split('T')[0];

    try {
      const currentItem = items.find(item => item.id === itemId);
      if (!currentItem) return;

      const updatedItem = {
        ...currentItem,
        isReviewed: true,
        lastAccessedAt: currentDateString,
        nextReviewDate: nextReviewDateString,
        reviewDates: [...(currentItem.reviewDates || []), currentDateString]
      };

      const savedItem = await itemsApi.update(itemId, updatedItem);
      setItems(prev => prev.map(item => 
        item.id === itemId ? savedItem : item
      ));
      console.log(`Item ${itemId} reviewed with ${reviewType}${customDays ? ` for ${customDays} days` : ` for ${daysToAdd} days`} - next review: ${nextReviewDateString}`);
    } catch (error) {
      console.error('Failed to update review:', error);
      // Optionally show error message to user
    }
  };

  const handleArchive = async (itemId: string) => {
    try {
      // Find the item and mark it as archived
      const itemToArchive = items.find(item => item.id === itemId);
      if (!itemToArchive) {
        console.error('Item not found:', itemId);
        return;
      }

      // Update item with archived flag
      const archivedItem = { ...itemToArchive, archived: true };
      await itemsApi.update(itemId, archivedItem);
      
      // Remove from UI (archived items should not display)
      setItems(prev => prev.filter(item => item.id !== itemId));
      console.log(`Item ${itemId} archived successfully`);
    } catch (error) {
      console.error('Failed to archive item:', error);
      // Optionally show error message to user
    }
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
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >
          + New Item
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading...
          </div>
        ) : (
          Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
            <ItemGrid
              key={categoryName}
              items={categoryItems}
              categoryName={categoryName}
              onShowAnswer={handleShowAnswer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDoubleClick={handleDoubleClick}
            />
          ))
        )}
      </div>

      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleNewItem}
        editItem={editingItem}
        categories={allCategories}
        selectedCategory={selectedCategory || allCategories[0] || 'Default'}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseModals}
        onReview={handleReview}
        onArchive={handleArchive}
        item={selectedItem}
        settings={settings}
      />

      <ShowAnswerModal
        isOpen={isShowAnswerModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
