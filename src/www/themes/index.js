/**
 * Theme Manager - Phase 3.1
 * Central theme selection and application
 * Handles light/dark theme switching with full color token exports
 */

import { lightTheme, contrastRatios as lightContrast } from './light.js';
import { darkTheme, contrastRatios as darkContrast } from './dark.js';

// Theme definitions
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Default theme
export const DEFAULT_THEME = THEMES.LIGHT;

/**
 * Get all tokens for a specific theme
 * @param {string} themeName - Theme name ('light' or 'dark')
 * @returns {object} Complete color token object for the theme
 */
export function getTokensForTheme(themeName) {
  switch (themeName) {
    case THEMES.DARK:
      return {
        ...darkTheme,
        contrastRatios: darkContrast,
      };
    case THEMES.LIGHT:
    default:
      return {
        ...lightTheme,
        contrastRatios: lightContrast,
      };
  }
}

/**
 * Get current theme from localStorage or system preference
 * @returns {string} Current theme name
 */
export function getCurrentTheme() {
  // Check localStorage first
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored && (stored === THEMES.LIGHT || stored === THEMES.DARK)) {
      return stored;
    }
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
  }

  // Default to light
  return DEFAULT_THEME;
}

/**
 * Save theme preference to localStorage
 * @param {string} themeName - Theme name to save
 */
export function setCurrentTheme(themeName) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', themeName);
  }
}

/**
 * Apply theme to document root
 * @param {string} themeName - Theme name to apply
 */
export function applyTheme(themeName) {
  const theme = getTokensForTheme(themeName);

  // Apply CSS variables to document root
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string' && !key.startsWith('contrastRatios')) {
        // Convert camelCase to kebab-case
        const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      }
    });
  }

  setCurrentTheme(themeName);
}

/**
 * Toggle between light and dark themes
 * @returns {string} New theme name
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  applyTheme(next);
  return next;
}

export default {
  THEMES,
  DEFAULT_THEME,
  getTokensForTheme,
  getCurrentTheme,
  setCurrentTheme,
  applyTheme,
  toggleTheme,
};
