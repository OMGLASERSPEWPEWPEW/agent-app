// HomeScreen.tsx
// Path: agent-app/src/screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApi } from '../context/ApiContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isConnected, isLoading, testConnection, getSuggestions } = useApi();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, [isConnected]);

  const loadSuggestions = async () => {
    try {
      const newSuggestions = await getSuggestions();
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await testConnection();
      await loadSuggestions();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    // Navigate to Chat screen with the suggestion
    navigation.navigate('Chat', { initialMessage: suggestion });
  };

  const handleConnectionTest = async () => {
    const connected = await testConnection();
    Alert.alert(
      'Connection Test',
      connected 
        ? 'Successfully connected to AI server!' 
        : 'Failed to connect to AI server. Check your settings.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AI Agent</Text>
          <Text style={styles.headerSubtitle}>Your personal AI assistant</Text>
        </LinearGradient>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]}>
            <Ionicons 
              name={isConnected ? 'checkmark-circle' : 'alert-circle'} 
              size={20} 
              color="white" 
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleConnectionTest}
            disabled={isLoading}
          >
            <Ionicons name="refresh" size={16} color="#3b82f6" />
            <Text style={styles.testButtonText}>Test</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubbles" size={24} color="#3b82f6" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Start Conversation</Text>
              <Text style={styles.actionSubtitle}>Chat with your AI assistant</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="settings" size={24} color="#10b981" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>Configure server connection</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Conversation Starters */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conversation Starters</Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionCard}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Ionicons name="arrow-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Server Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[
              styles.infoValue, 
              { color: isConnected ? '#10b981' : '#ef4444' }
            ]}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
          
          {isConnected && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>AI Model</Text>
              <Text style={styles.infoValue}>LLaMA 3.2</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginRight: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  testButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  suggestionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;

// File length: 8,108 characters