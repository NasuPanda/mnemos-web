import type { StudyItem } from '../components/ItemCard';
import type { AppSettings } from '../types/Settings';

const API_BASE = 'http://localhost:8000';

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
  archived: false
});

// API service functions
export const itemsApi = {
  async getAll(): Promise<StudyItem[]> {
    const response = await fetch(`${API_BASE}/api/items`);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(transformToFrontend);
  },

  async create(item: Omit<StudyItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'isReviewed'>): Promise<StudyItem> {
    const backendItem = transformToBackend(item);
    const response = await fetch(`${API_BASE}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendItem),
    });
    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`);
    }
    const data = await response.json();
    return transformToFrontend(data);
  },

  async update(id: string, item: StudyItem): Promise<StudyItem> {
    const backendItem = transformToBackend(item);
    const response = await fetch(`${API_BASE}/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendItem),
    });
    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`);
    }
    const data = await response.json();
    return transformToFrontend(data);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
  }
};

export const settingsApi = {
  async get(): Promise<AppSettings> {
    const response = await fetch(`${API_BASE}/api/data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      confidentDays: data.settings.confident_days,
      mediumDays: data.settings.medium_days,
      wtfDays: data.settings.wtf_days
    };
  },

  async update(settings: AppSettings): Promise<AppSettings> {
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
      throw new Error(`Failed to update settings: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      confidentDays: data.confident_days,
      mediumDays: data.medium_days,
      wtfDays: data.wtf_days
    };
  }
};

export const categoriesApi = {
  async getAll(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/api/data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.categories || [];
  }
};