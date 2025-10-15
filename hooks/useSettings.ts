/**
 * useSettings Hook
 */

import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = localStorage.getItem('cloudgov-settings');
        if (stored) setSettings(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: any) => {
    setIsSaving(true);
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      localStorage.setItem('cloudgov-settings', JSON.stringify(updated));
      return updated;
    } finally {
      setIsSaving(false);
    }
  };

  return { settings, isLoading, isSaving, updateSettings };
}
