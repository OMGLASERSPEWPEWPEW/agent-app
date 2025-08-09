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
import { useAppMode } from '../context/AppModeContext';
import { useDatabase } from '../context/DatabaseContext';
import ModeToggle from '../components/ModeToggle';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isConnected, isLoading, testConnection, getSuggestions } = useApi();
  const { mode, setMode, isTrainer, isUser } = useAppMode();
  const { isReady: isDatabaseReady } = useDatabase();
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

  const handleEnterDashboard = () => {
    if (isTrainer) {
      navigation.navigate('TrainerDashboard');
    } else {
      navigation.navigate('UserDashboard');
    }
  };

  const handleModeChange = (newMode: 'trainer' | 'user') => {
    setMode(newMode);
  };

  const getDashboardTitle = () => {
    return isTrainer ? 'Trainer Dashboard' : 'My Fitness Journey';
  };

  const getDashboardDescription = () => {
    return isTrainer 
      ? 'Manage clients, create workouts, and track training progress'
      : 'View your workouts, track progress, and achieve your goals';
  };

  const getDashboardIcon = () => {
    return isTrainer ? 'fitness' : 'trophy';
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
          colors={isTrainer ? ['#3b82f6', '#1d4ed8'] : ['#10b981', '#059669']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AI Agent</Text>
          <Text style={styles.headerSubtitle}>
            {isTrainer ? 'Professional Training Assistant' : 'Your personal AI fitness companion'}
          </Text>
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
              {isConnected ? 'AI Server Connected' : 'AI Server Disconnected'}
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

        {/* Mode Toggle */}
        <View style={styles.modeSection}>
          <ModeToggle
            currentMode={mode}
            onModeChange={handleModeChange}
            disabled={isLoading}
          />
        </View>

        

        {/* Database Status */}
        {!isDatabaseReady && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="hourglass" size={20} color="white" />
              <Text style={styles.statusText}>Database Initializing...</Text>
            </View>
          </View>
        )}

        {/* Main Dashboard Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <TouchableOpacity 
            style={[
              styles.dashboardCard,
              { borderColor: isTrainer ? '#3b82f6' : '#10b981' }
            ]}
            onPress={handleEnterDashboard}
            disabled={!isDatabaseReady}
          >
            <View style={[
              styles.dashboardIcon,
              { backgroundColor: isTrainer ? '#eff6ff' : '#dcfce7' }
            ]}>
              <Ionicons 
                name={getDashboardIcon() as any} 
                size={32} 
                color={isTrainer ? '#3b82f6' : '#10b981'} 
              />
            </View>
            <View style={styles.dashboardContent}>
              <Text style={styles.dashboardTitle}>{getDashboardTitle()}</Text>
              <Text style={styles.dashboardDescription}>{getDashboardDescription()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
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
              <Text style={styles.actionTitle}>AI Chat</Text>
              <Text style={styles.actionSubtitle}>
                {isTrainer ? 'Get training insights and advice' : 'Ask questions about your fitness journey'}
              </Text>
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
              <Text style={styles.actionSubtitle}>Configure app and server settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isTrainer ? 'Training Questions' : 'Conversation Starters'}
            </Text>
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

        {/* System Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Mode</Text>
              <Text style={[
                styles.infoValue, 
                { color: isTrainer ? '#3b82f6' : '#10b981' }
              ]}>
                {isTrainer ? 'Trainer' : 'User'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AI Server</Text>
              <Text style={[
                styles.infoValue, 
                { color: isConnected ? '#10b981' : '#ef4444' }
              ]}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Database</Text>
              <Text style={[
                styles.infoValue, 
                { color: isDatabaseReady ? '#10b981' : '#f59e0b' }
              ]}>
                {isDatabaseReady ? 'Ready' : 'Initializing'}
              </Text>
            </View>
          </View>
        </View>

        {/* Mode-specific Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isTrainer ? 'Trainer Tips' : 'Fitness Tips'}
          </Text>
          <View style={styles.tipCard}>
            <Ionicons 
              name="bulb" 
              size={24} 
              color={isTrainer ? '#3b82f6' : '#10b981'} 
            />
            <Text style={styles.tipText}>
              {isTrainer 
                ? 'Create detailed training notes to build your knowledge base and provide better guidance to clients.'
                : 'Consistency is key! Even 15 minutes of exercise daily can make a significant difference in your fitness journey.'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  modeSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  testButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  dashboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dashboardContent: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  dashboardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  tipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});

export default HomeScreen;

// File length: 11,406 characters