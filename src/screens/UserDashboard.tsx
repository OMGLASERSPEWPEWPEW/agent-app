// UserDashboard.tsx
// Path: agent-app/src/screens/UserDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../context/DatabaseContext';

interface UserDashboardProps {
  navigation: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ navigation }) => {
  const { isReady } = useDatabase();
  const [refreshing, setRefreshing] = useState(false);
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);

  // Mock user data - in real app, this would come from authentication
  const MOCK_USER = {
    id: 'user_001',
    name: 'Alex Johnson',
    currentGoals: ['Lose 10 lbs', 'Run 5K', 'Build strength'],
    streak: 5, // workout streak
    weeklyGoal: 4, // workouts per week
    completedThisWeek: 2,
  };

  useEffect(() => {
    if (isReady) {
      loadUserData();
    }
  }, [isReady]);

  const loadUserData = async () => {
    try {
      // TODO: Load actual user data, workouts, progress
      console.log('Loading user dashboard data...');
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleStartWorkoutPress = () => {
    Alert.alert(
      'Start Workout',
      'Coming soon! This will launch your scheduled workout for today.',
      [{ text: 'OK' }]
    );
  };

  const handleProgressPress = () => {
    Alert.alert(
      'Progress Tracking',
      'Coming soon! This will show your detailed progress, measurements, and achievements.',
      [{ text: 'OK' }]
    );
  };

  const handleGoalsPress = () => {
    Alert.alert(
      'My Goals',
      'Coming soon! This will let you view and manage your fitness goals.',
      [{ text: 'OK' }]
    );
  };

  const handleNutritionPress = () => {
    Alert.alert(
      'Nutrition Guide',
      'Coming soon! This will provide meal planning and nutrition tracking.',
      [{ text: 'OK' }]
    );
  };

  const handleChatWithTrainerPress = () => {
    navigation.navigate('Chat', { 
      initialMessage: 'Hi! I have a question about my workout plan.' 
    });
  };

  const getMotivationalMessage = () => {
    const messages = [
      "You're crushing it! Keep up the great work! 💪",
      "Every workout brings you closer to your goals! 🎯",
      "Consistency is key - you're building amazing habits! ⭐",
      "Your future self will thank you for today's effort! 🚀",
      "Progress, not perfection - you're doing fantastic! 🌟"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your fitness journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
        >
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Hello, {MOCK_USER.name}! 👋</Text>
              <Text style={styles.headerSubtitle}>Ready for today's workout?</Text>
            </View>
            <View style={styles.userBadge}>
              <Ionicons name="person" size={24} color="white" />
            </View>
          </View>
          
          {/* Motivational Message */}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
          </View>
        </LinearGradient>

        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {getStreakEmoji(MOCK_USER.streak)} {MOCK_USER.streak}
            </Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {MOCK_USER.completedThisWeek}/{MOCK_USER.weeklyGoal}
            </Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_USER.currentGoals.length}</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          
          {todaysWorkout ? (
            <View style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>{todaysWorkout.name}</Text>
                <Text style={styles.workoutDuration}>{todaysWorkout.duration} min</Text>
              </View>
              <Text style={styles.workoutDescription}>{todaysWorkout.description}</Text>
              <TouchableOpacity 
                style={styles.startWorkoutButton}
                onPress={handleStartWorkoutPress}
              >
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.startWorkoutText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noWorkoutCard}>
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text style={styles.noWorkoutTitle}>No Workout Scheduled</Text>
              <Text style={styles.noWorkoutSubtitle}>
                Your trainer hasn't assigned a workout for today, or you've completed it already!
              </Text>
              <TouchableOpacity 
                style={styles.chatTrainerButton}
                onPress={handleChatWithTrainerPress}
              >
                <Ionicons name="chatbubbles" size={16} color="#3b82f6" />
                <Text style={styles.chatTrainerText}>Ask your trainer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleProgressPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ddd6fe' }]}>
                <Ionicons name="analytics" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.actionTitle}>Progress</Text>
              <Text style={styles.actionSubtitle}>View stats</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleGoalsPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="flag" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionTitle}>Goals</Text>
              <Text style={styles.actionSubtitle}>Track targets</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleNutritionPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="nutrition" size={24} color="#10b981" />
              </View>
              <Text style={styles.actionTitle}>Nutrition</Text>
              <Text style={styles.actionSubtitle}>Meal plans</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleChatWithTrainerPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="chatbubbles" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.actionTitle}>Chat</Text>
              <Text style={styles.actionSubtitle}>Ask trainer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Goals</Text>
          
          {MOCK_USER.currentGoals.map((goal, index) => (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalContent}>
                <Ionicons name="flag-outline" size={20} color="#3b82f6" />
                <Text style={styles.goalText}>{goal}</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.random() * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.floor(Math.random() * 100)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityCard}>
            <Ionicons name="time-outline" size={20} color="#6b7280" />
            <Text style={styles.activityText}>
              No recent activity to show. Complete your first workout to see your progress here!
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 1,
    padding: 8,
    },
  userBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
  },
  motivationText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  workoutCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  startWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noWorkoutCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noWorkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noWorkoutSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  chatTrainerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  chatTrainerText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalCard: {
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
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 35,
    textAlign: 'right',
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default UserDashboard;

// File length: 12,284 characters