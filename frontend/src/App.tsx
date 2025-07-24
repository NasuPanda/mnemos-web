import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import NewItemModal from './components/NewItemModal';
import ReviewModal from './components/ReviewModal';
import ShowAnswerModal from './components/ShowAnswerModal';
import SettingsModal from './components/SettingsModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider, useToast } from './components/Toast';
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

// Main App component with Toast context
function AppContent() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isServiceStarting, setIsServiceStarting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShowAnswerModalOpen, setIsShowAnswerModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);
  const [editingItem, setEditingItem] = useState<StudyItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Archive confirmation dialog state
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  
  // Toast context
  const { showToast } = useToast();

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reset review status when currentDate changes (e.g., when user navigates dates)
  useEffect(() => {
    if (items.length > 0) {
      resetDueItemsReviewStatus(items).then(updatedItems => {
        setItems(updatedItems);
      });
    }
  }, [currentDate]);

  // Reset review status for items that are due today
  const resetDueItemsReviewStatus = async (itemsToCheck: StudyItem[]): Promise<StudyItem[]> => {
    const today = formatDateForComparison(new Date());
    const itemsToUpdate: StudyItem[] = [];
    
    // Find items that are due today but still marked as reviewed
    const updatedItems = itemsToCheck.map(item => {
      if (item.nextReviewDate === today && item.isReviewed) {
        // Reset review status for items due today
        const updatedItem = { ...item, isReviewed: false };
        itemsToUpdate.push(updatedItem);
        return updatedItem;
      }
      return item;
    });
    
    // Update backend for items that need status reset
    if (itemsToUpdate.length > 0) {
      try {
        await Promise.all(
          itemsToUpdate.map(item => itemsApi.update(item.id, item))
        );
        console.log(`Reset review status for ${itemsToUpdate.length} items due today`);
      } catch (error) {
        console.error('Failed to reset review status for due items:', error);
      }
    }
    
    return updatedItems;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setIsServiceStarting(false);
      setRetryCount(0);
      
      const [itemsData, settingsData, categoriesData] = await Promise.all([
        itemsApi.getAll(),
        settingsApi.get(),
        categoriesApi.getAll()
      ]);
      
      // Reset review status for items due today
      const itemsWithResetStatus = await resetDueItemsReviewStatus(itemsData);
      
      setItems(itemsWithResetStatus);
      setSettings(settingsData);
      setAllCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      
      // Check if this is a service startup error (503)
      if (error instanceof Error && (error.message.includes('503') || error.message.includes('Service Unavailable'))) {
        setIsServiceStarting(true);
        // Listen for retry attempts from the console logs
        const originalLog = console.log;
        console.log = (...args) => {
          if (args[0]?.includes('attempt')) {
            const match = args[0].match(/attempt (\d+)/);
            if (match) {
              setRetryCount(parseInt(match[1]));
            }
          }
          originalLog(...args);
        };
        
        // Retry loading data automatically
        setTimeout(() => {
          console.log = originalLog; // Restore original console.log
          loadData();
        }, 1000);
      } else {
        // For other errors, just fallback to default settings
        setSettings(DEFAULT_SETTINGS);
      }
    } finally {
      if (!isServiceStarting) {
        setLoading(false);
      }
    }
  };

  // Use predefined categories from backend for default selection (no filtering)
  const categories = allCategories;

  // Helper function to format date for comparison (YYYY-MM-DD)
  const formatDateForComparison = (date: Date): string => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
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
        
        // Show success toast with delay to ensure UI updates properly
        setTimeout(() => {
          showToast(`"${item.name}" has been deleted`, 'success');
        }, 100);
        
      } catch (error) {
        console.error('Failed to delete item:', error);
        showToast('Failed to delete item. Please try again.', 'error');
      }
    }
  };

  const handleOpenReviewModal = (item: StudyItem) => {
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
        
        // Show success toast with delay to ensure modal closes first
        setTimeout(() => {
          showToast(`"${newItemData.name}" has been updated`, 'success');
        }, 100);
        
      } else {
        // Create new item
        const newItem = await itemsApi.create(newItemData);
        setItems(prev => [...prev, newItem]);
        
        // Show success toast with delay to ensure modal closes first
        setTimeout(() => {
          showToast(`"${newItemData.name}" has been created`, 'success');
        }, 100);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      
      // Show error toast with user-friendly message
      const operation = editingItem ? 'update' : 'create';
      showToast(`Failed to ${operation} item. Please try again.`, 'error');
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
    const nextReviewDateString = nextReviewDate.toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone

    // Current date for review history
    const currentDateString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone

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

  const handleArchive = (itemId: string) => {
    // Show confirmation dialog
    setItemToArchive(itemId);
    setIsArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    if (!itemToArchive) return;

    try {
      // Find the item and mark it as archived
      const itemToArchiveData = items.find(item => item.id === itemToArchive);
      if (!itemToArchiveData) {
        showToast('Item not found', 'error');
        return;
      }

      // Update item with archived flag
      const archivedItem = { ...itemToArchiveData, archived: true };
      await itemsApi.update(itemToArchive, archivedItem);
      
      // Remove from UI (archived items should not display)
      setItems(prev => prev.filter(item => item.id !== itemToArchive));
      
      // Show success toast after a brief delay to ensure dialog is closed
      setTimeout(() => {
        console.log('Triggering success toast...'); // Debug log
        showToast(`"${itemToArchiveData.name}" has been archived`, 'success');
      }, 100);
      
      console.log(`Item ${itemToArchive} archived successfully`);
    } catch (error) {
      console.error('Failed to archive item:', error);
      showToast('Failed to archive item. Please try again.', 'error');
    } finally {
      setItemToArchive(null);
    }
  };

  const handleCloseModals = () => {
    setIsNewItemModalOpen(false);
    setIsReviewModalOpen(false);
    setIsShowAnswerModalOpen(false);
    setSelectedItem(null);
    setEditingItem(null);
  };

  // Calculate daily progress stats for all items - only show for today
  const stats = useMemo(() => {
    const dateString = currentDate.toLocaleDateString('en-CA');
    const todayString = new Date().toLocaleDateString('en-CA');
    
    // Only calculate stats if viewing today's date
    if (dateString !== todayString) {
      return { total: 0, reviewed: 0 };
    }
    
    // All items that have any interaction with this date
    const allRelevantItems = items.filter(item => {
      // Currently due today
      const isDueToday = (item.nextReviewDate === dateString) || 
                        (!item.nextReviewDate && !item.isReviewed);
      
      // Was reviewed today (even if now scheduled for future)
      // Note: lastAccessedAt is ISO timestamp from backend, need to extract date part
      const itemAccessDate = item.lastAccessedAt ? item.lastAccessedAt.split('T')[0] : null;
      const wasReviewedToday = item.isReviewed && itemAccessDate === dateString;
      
      return isDueToday || wasReviewedToday;
    });
    
    const reviewedToday = allRelevantItems.filter(item => {
      const itemAccessDate = item.lastAccessedAt ? item.lastAccessedAt.split('T')[0] : null;
      return item.isReviewed && itemAccessDate === dateString;
    });
    
    return { 
      total: allRelevantItems.length, 
      reviewed: reviewedToday.length 
    };
  }, [items, currentDate]);

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
        stats={stats}
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
          isServiceStarting ? (
            <LoadingSpinner
              message="Service Starting Up"
              submessage={`Please wait while the service initializes... ${retryCount > 0 ? `(Attempt ${retryCount})` : ''}`}
              type="service-starting"
            />
          ) : (
            <LoadingSpinner
              message="Loading Your Study Items"
              submessage="This should only take a moment..."
              type="normal"
            />
          )
        ) : (
          Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
            <ItemGrid
              key={categoryName}
              items={categoryItems}
              categoryName={categoryName}
              onShowAnswer={handleShowAnswer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDoubleClick={handleOpenReviewModal}
              onReview={handleOpenReviewModal}
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
        allCategories={allCategories}
        onCategoriesUpdate={loadData}
      />

      <ConfirmationDialog
        isOpen={isArchiveDialogOpen}
        onClose={() => {
          setIsArchiveDialogOpen(false);
          setItemToArchive(null);
        }}
        onConfirm={confirmArchive}
        title="Archive Item"
        message="Are you sure you want to archive this item? It will be hidden from your study sessions but can be restored later."
        confirmText="Archive"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}

// App wrapper with Toast provider
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
