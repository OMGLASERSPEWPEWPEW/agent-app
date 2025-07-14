// ApiContext.tsx
// Path: agent-app/src/context/ApiContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

interface ApiContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  sendMessage: (message: string) => Promise<string>;
  testConnection: () => Promise<boolean>;
  getSuggestions: () => Promise<string[]>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [serverUrl, setServerUrlState] = useState('http://192.168.1.100:3001');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved server URL on app start
  useEffect(() => {
    loadServerUrl();
  }, []);

  // Test connection when server URL changes
  useEffect(() => {
    if (serverUrl) {
      testConnection();
    }
  }, [serverUrl]);

  const loadServerUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('serverUrl');
      if (savedUrl) {
        setServerUrlState(savedUrl);
      }
    } catch (error) {
      console.error('Failed to load server URL:', error);
    }
  };

  const setServerUrl = async (url: string) => {
    try {
      // Clean up URL format
      const cleanUrl = url.trim().replace(/\/$/, ''); // Remove trailing slash
      setServerUrlState(cleanUrl);
      await AsyncStorage.setItem('serverUrl', cleanUrl);
    } catch (error) {
      console.error('Failed to save server URL:', error);
    }
  };

  const testConnection = async (): Promise<boolean> => {
    if (!serverUrl) {
      setIsConnected(false);
      return false;
    }

    setIsLoading(true);
    try {
      // Check network connectivity first
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        console.log('No network connection');
        setIsConnected(false);
        return false;
      }

      // Create timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const connected = data.status === 'healthy';
        setIsConnected(connected);
        console.log('Server connection test:', connected ? 'SUCCESS' : 'FAILED');
        return connected;
      } else {
        console.log('Server responded with error:', response.status);
        setIsConnected(false);
        return false;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Connection test timed out');
      }
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string): Promise<string> => {
    if (!serverUrl || !isConnected) {
      throw new Error('Not connected to server');
    }

    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      setIsLoading(true);
      
      // Create timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${serverUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': await getSessionId(),
        },
        body: JSON.stringify({
          message: message.trim(),
          options: {
            maxTokens: 150,
            temperature: 0.7
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get response');
      }

      return data.response;
    } catch (error) {
      console.error('Failed to send message:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out - please try again');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Network error - check your connection and server URL');
        }
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (): Promise<string[]> => {
    if (!serverUrl) {
      return getDefaultSuggestions();
    }

    try {
      // Create timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverUrl}/api/chat/suggestions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.suggestions || getDefaultSuggestions();
      } else {
        console.log('Failed to get suggestions from server, using defaults');
        return getDefaultSuggestions();
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return getDefaultSuggestions();
    }
  };

  const getDefaultSuggestions = (): string[] => {
    return [
      "How can I be more productive today?",
      "What are some good time management tips?",
      "Help me organize my daily routine",
    ];
  };

  const getSessionId = async (): Promise<string> => {
    try {
      let sessionId = await AsyncStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (error) {
      console.error('Failed to get session ID:', error);
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  };

  return (
    <ApiContext.Provider
      value={{
        serverUrl,
        setServerUrl,
        isConnected,
        isLoading,
        sendMessage,
        testConnection,
        getSuggestions,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// File length: 5,393 characters