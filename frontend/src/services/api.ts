import type { StudyItem } from '../components/ItemCard';
import type { AppSettings } from '../types/Settings';

// Use relative URLs in production, localhost in development
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:8000';

// Retry configuration for service startup
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 8000   // 8 seconds
};

// Sleep utility for delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper function for API calls
async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  operation: string = 'API call'
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      // Check if this is a 503 Service Unavailable error (service starting up)
      if (error instanceof Error && (error.message.includes('503') || error.message.includes('Service Unavailable'))) {
        if (attempt < RETRY_CONFIG.maxRetries) {
          const delay = Math.min(
            RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
            RETRY_CONFIG.maxDelay
          );
          console.log(`${operation} failed with 503 (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}), retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        } else {
          console.error(`${operation} failed after ${RETRY_CONFIG.maxRetries + 1} attempts`);
        }
      }
      
      // For non-503 errors, don't retry
      throw error;
    }
  }
  
  throw lastError;
}

// Data transformation functions
const transformToFrontend = (backendItem: any): StudyItem => ({
  id: backendItem.id,
  name: backendItem.name,
  category: backendItem.section,
  problem: backendItem.problem_text || '',
  answer: backendItem.answer_text || '',
  createdAt: backendItem.created_date,
  lastAccessedAt: backendItem.last_accessed,
  isReviewed: backendItem.reviewed,
  nextReviewDate: backendItem.next_review_date,
  reviewDates: backendItem.review_dates || [],
  sideNote: backendItem.side_note || '',
  problemUrl: backendItem.problem_url,
  problemImages: backendItem.problem_images || [],
  answerUrl: backendItem.answer_url,
  answerImages: backendItem.answer_images || [],
  hasLink: !!(backendItem.problem_url || backendItem.answer_url),
  hasImage: !!(backendItem.problem_images?.length || backendItem.answer_images?.length)
});

const transformToBackend = (frontendItem: Partial<StudyItem>): any => ({
  name: frontendItem.name,
  section: frontendItem.category,
  side_note: frontendItem.sideNote || '',
  problem_text: frontendItem.problem,
  problem_url: frontendItem.problemUrl,
  problem_images: frontendItem.problemImages || [],
  answer_text: frontendItem.answer,
  answer_url: frontendItem.answerUrl,
  answer_images: frontendItem.answerImages || [],
  reviewed: frontendItem.isReviewed || false,
  next_review_date: frontendItem.nextReviewDate,
  review_dates: frontendItem.reviewDates || [],
  created_date: frontendItem.createdAt || new Date().toISOString(),
  last_accessed: frontendItem.lastAccessedAt || new Date().toISOString(),
  archived: frontendItem.archived || false
});

// API service functions
export const itemsApi = {
  async getAll(): Promise<StudyItem[]> {
    return retryApiCall(async () => {
      const response = await fetch(`${API_BASE}/api/items`);
      if (!response.ok) {
        throw new Error(`Failed to fetch items (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return data.map(transformToFrontend);
    }, 'Get all items');
  },

  async create(item: Omit<StudyItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'isReviewed'>): Promise<StudyItem> {
    return retryApiCall(async () => {
      const backendItem = transformToBackend(item);
      const response = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendItem),
      });
      if (!response.ok) {
        throw new Error(`Failed to create item (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return transformToFrontend(data);
    }, 'Create item');
  },

  async update(id: string, item: StudyItem): Promise<StudyItem> {
    return retryApiCall(async () => {
      const backendItem = transformToBackend(item);
      const response = await fetch(`${API_BASE}/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendItem),
      });
      if (!response.ok) {
        throw new Error(`Failed to update item (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return transformToFrontend(data);
    }, 'Update item');
  },

  async delete(id: string): Promise<void> {
    return retryApiCall(async () => {
      const response = await fetch(`${API_BASE}/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete item (${response.status}): ${response.statusText}`);
      }
    }, 'Delete item');
  }
};

export const settingsApi = {
  async get(): Promise<AppSettings> {
    return retryApiCall(async () => {
      const response = await fetch(`${API_BASE}/api/data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch settings (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return {
        confidentDays: data.settings.confident_days,
        mediumDays: data.settings.medium_days,
        wtfDays: data.settings.wtf_days
      };
    }, 'Get settings');
  },

  async update(settings: AppSettings): Promise<AppSettings> {
    return retryApiCall(async () => {
      const backendSettings = {
        confident_days: settings.confidentDays,
        medium_days: settings.mediumDays,
        wtf_days: settings.wtfDays
      };
      const response = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendSettings),
      });
      if (!response.ok) {
        throw new Error(`Failed to update settings (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return {
        confidentDays: data.confident_days,
        mediumDays: data.medium_days,
        wtfDays: data.wtf_days
      };
    }, 'Update settings');
  }
};

export const categoriesApi = {
  async getAll(): Promise<string[]> {
    return retryApiCall(async () => {
      const response = await fetch(`${API_BASE}/api/data`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories (${response.status}): ${response.statusText}`);
      }
      const data = await response.json();
      return data.categories || [];
    }, 'Get categories');
  }
};
