import type { ThemeConfig } from '../types';

export const loadTheme = async (themeId: string): Promise<ThemeConfig> => {
  const response = await fetch(`/config/themes/${themeId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load theme: ${themeId}`);
  }
  return await response.json();
};

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  root.style.setProperty('--primary-color', theme.colors.primary);
  root.style.setProperty('--secondary-color', theme.colors.secondary);
  root.style.setProperty('--background-color', theme.colors.background);
  root.style.setProperty('--surface-color', theme.colors.surface);
  root.style.setProperty('--text-color', theme.colors.text);
  root.style.setProperty('--text-secondary-color', theme.colors.textSecondary);
  root.style.setProperty('--border-color', theme.colors.border);
  root.style.setProperty('--accent-color', theme.colors.accent);
  root.style.setProperty('--success-color', theme.colors.success);
  root.style.setProperty('--warning-color', theme.colors.warning);
  root.style.setProperty('--error-color', theme.colors.error);
  
  // Apply branding
  root.style.setProperty('--logo-color', theme.branding.logoColor);
  root.style.setProperty('--logo-font-size', theme.branding.logoFontSize);
  root.style.setProperty('--logo-font-weight', theme.branding.logoFontWeight);
};

