// ModeToggle.tsx
// Path: agent-app/src/components/ModeToggle.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppMode, ModeToggleProps } from '../types/fitness.types';

const ModeToggle: React.FC<ModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
}) => {
  const handleModePress = (mode: AppMode) => {
    if (disabled || mode === currentMode) return;
    onModeChange(mode);
  };

  const getModeIcon = (mode: AppMode) => {
    return mode === 'trainer' ? 'fitness' : 'person';
  };

  const getModeLabel = (mode: AppMode) => {
    return mode === 'trainer' ? 'Trainer' : 'User';
  };

  const getModeDescription = (mode: AppMode) => {
    return mode === 'trainer' 
      ? 'Create workouts and manage clients'
      : 'Follow workouts and track progress';
  };

  const isSelected = (mode: AppMode) => mode === currentMode;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>
        Switch between trainer and user modes anytime
      </Text>
      
      <View style={styles.toggleContainer}>
        {/* Trainer Mode Button */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            isSelected('trainer') && styles.selectedButton,
            disabled && styles.disabledButton,
          ]}
          onPress={() => handleModePress('trainer')}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={styles.modeContent}>
            <View style={[
              styles.iconContainer,
              isSelected('trainer') && styles.selectedIconContainer
            ]}>
              <Ionicons
                name={getModeIcon('trainer')}
                size={32}
                color={isSelected('trainer') ? '#ffffff' : '#3b82f6'}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[
                styles.modeLabel,
                isSelected('trainer') && styles.selectedText
              ]}>
                {getModeLabel('trainer')}
              </Text>
              <Text style={[
                styles.modeDescription,
                isSelected('trainer') && styles.selectedDescription
              ]}>
                {getModeDescription('trainer')}
              </Text>
            </View>
            
            {isSelected('trainer') && (
              <View style={styles.checkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* User Mode Button */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            isSelected('user') && styles.selectedButton,
            disabled && styles.disabledButton,
          ]}
          onPress={() => handleModePress('user')}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={styles.modeContent}>
            <View style={[
              styles.iconContainer,
              isSelected('user') && styles.selectedIconContainer
            ]}>
              <Ionicons
                name={getModeIcon('user')}
                size={32}
                color={isSelected('user') ? '#ffffff' : '#10b981'}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[
                styles.modeLabel,
                isSelected('user') && styles.selectedText
              ]}>
                {getModeLabel('user')}
              </Text>
              <Text style={[
                styles.modeDescription,
                isSelected('user') && styles.selectedDescription
              ]}>
                {getModeDescription('user')}
              </Text>
            </View>
            
            {isSelected('user') && (
              <View style={styles.checkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Current Mode Indicator */}
      <View style={styles.currentModeIndicator}>
        <Ionicons 
          name="information-circle-outline" 
          size={16} 
          color="#6b7280" 
        />
        <Text style={styles.currentModeText}>
          Currently in {getModeLabel(currentMode)} mode
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    gap: 12,
  },
  modeButton: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  selectedButton: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedText: {
    color: '#ffffff',
  },
  modeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  selectedDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkContainer: {
    marginLeft: 12,
  },
  currentModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  currentModeText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default ModeToggle;

// File length: 5,247 characters