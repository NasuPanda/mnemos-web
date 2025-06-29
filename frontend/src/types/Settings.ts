export interface AppSettings {
  confidentDays: number;
  mediumDays: number;
  wtfDays: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  confidentDays: 7,
  mediumDays: 3,
  wtfDays: 1
};

// Settings storage key for localStorage
export const SETTINGS_STORAGE_KEY = 'mnemos-settings';

// Settings utilities
export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that all required fields exist and are numbers
      if (
        typeof parsed.confidentDays === 'number' &&
        typeof parsed.mediumDays === 'number' &&
        typeof parsed.wtfDays === 'number' &&
        parsed.confidentDays > 0 &&
        parsed.mediumDays > 0 &&
        parsed.wtfDays > 0
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  // Return default settings if loading fails or data is invalid
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};