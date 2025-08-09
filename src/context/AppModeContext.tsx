// AppModeContext.tsx
// Path: agent-app/src/context/AppModeContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppMode, AppModeState } from '../types/fitness.types';

const APP_MODE_STORAGE_KEY = 'app_mode';
const DEFAULT_MODE: AppMode = 'user';

interface AppModeProviderProps {
  children: ReactNode;
}

const AppModeContext = createContext<AppModeState | undefined>(undefined);

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>(DEFAULT_MODE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved mode on app start
  useEffect(() => {
    loadSavedMode();
  }, []);

  const loadSavedMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(APP_MODE_STORAGE_KEY);
      if (savedMode && (savedMode === 'trainer' || savedMode === 'user')) {
        setModeState(savedMode as AppMode);
      }
    } catch (error) {
      console.error('Failed to load app mode:', error);
      // Use default mode if loading fails
      setModeState(DEFAULT_MODE);
    } finally {
      setIsInitialized(true);
    }
  };

  const setMode = async (newMode: AppMode) => {
    try {
      // Validate mode
      if (newMode !== 'trainer' && newMode !== 'user') {
        console.error('Invalid app mode:', newMode);
        return;
      }

      // Update state
      setModeState(newMode);
      
      // Persist to storage
      await AsyncStorage.setItem(APP_MODE_STORAGE_KEY, newMode);
      
      console.log(`App mode changed to: ${newMode}`);
    } catch (error) {
      console.error('Failed to save app mode:', error);
      // Revert state if save fails
      const savedMode = await AsyncStorage.getItem(APP_MODE_STORAGE_KEY);
      if (savedMode) {
        setModeState(savedMode as AppMode);
      }
    }
  };

  const contextValue: AppModeState = {
    mode,
    setMode,
    isTrainer: mode === 'trainer',
    isUser: mode === 'user',
  };

  // Don't render children until mode is loaded
  if (!isInitialized) {
    return null; // Or a loading spinner if desired
  }

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};

// Utility functions for mode checking
export const isTrainerMode = (mode: AppMode): boolean => mode === 'trainer';
export const isUserMode = (mode: AppMode): boolean => mode === 'user';

// Hook for easy mode checking
export const useModeCheck = () => {
  const { mode } = useAppMode();
  
  return {
    isTrainer: isTrainerMode(mode),
    isUser: isUserMode(mode),
    mode,
  };
};

// File length: 2,485 characters