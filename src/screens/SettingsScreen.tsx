// SettingsScreen.tsx
// Path: agent-app/src/screens/SettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../context/ApiContext';

const SettingsScreen: React.FC = () => {
  const { serverUrl, setServerUrl, isConnected, testConnection, isLoading } = useApi();
  const [tempUrl, setTempUrl] = useState(serverUrl);
  const [autoConnect, setAutoConnect] = useState(true);

  const handleSaveUrl = async () => {
    if (!tempUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid server URL.');
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(tempUrl.trim())) {
      Alert.alert(
        'Invalid URL',
        'Please enter a valid URL starting with http:// or https://'
      );
      return;
    }

    try {
      await setServerUrl(tempUrl.trim());
      Alert.alert('Success', 'Server URL updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save server URL.');
    }
  };

  const handleTestConnection = async () => {
    const connected = await testConnection();
    Alert.alert(
      'Connection Test',
      connected 
        ? '✅ Successfully connected to AI server!' 
        : '❌ Failed to connect to AI server. Please check your URL and network connection.',
      [{ text: 'OK' }]
    );
  };

  const resetToDefault = () => {
    Alert.alert(
      'Reset to Default',
      'This will reset the server URL to the default value. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            const defaultUrl = 'http://192.168.1.100:3001';
            setTempUrl(defaultUrl);
            setServerUrl(defaultUrl);
          }
        }
      ]
    );
  };

  const getConnectionStatusColor = () => {
    return isConnected ? '#10b981' : '#ef4444';
  };

  const getConnectionStatusText = () => {
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your AI agent connection</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusLeft}>
                <View style={[styles.statusDot, { backgroundColor: getConnectionStatusColor() }]} />
                <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
              </View>
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestConnection}
                disabled={isLoading}
              >
                <Ionicons name="refresh" size={16} color="#3b82f6" />
                <Text style={styles.testButtonText}>
                  {isLoading ? 'Testing...' : 'Test'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {isConnected && (
              <Text style={styles.connectedInfo}>
                AI model ready and responding
              </Text>
            )}
          </View>
        </View>

        {/* Server Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Configuration</Text>
          
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Server URL</Text>
            <TextInput
              style={styles.textInput}
              value={tempUrl}
              onChangeText={setTempUrl}
              placeholder="http://your-pc-ip:3001"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={styles.inputHint}>
              Enter your PC's IP address and port (default: 3001)
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSaveUrl}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Save URL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={resetToDefault}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Auto-connect on startup</Text>
                <Text style={styles.settingSubtitle}>
                  Automatically test connection when app launches
                </Text>
              </View>
              <Switch
                value={autoConnect}
                onValueChange={setAutoConnect}
                trackColor={{ false: '#f3f4f6', true: '#dbeafe' }}
                thumbColor={autoConnect ? '#3b82f6' : '#9ca3af'}
              />
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Setup</Text>
          
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Server Setup Instructions</Text>
            <Text style={styles.helpText}>
              1. Make sure your agent-server is running on your PC{'\n'}
              2. Find your PC's IP address (ipconfig on Windows){'\n'}
              3. Enter the URL as: http://YOUR_PC_IP:3001{'\n'}
              4. Test the connection to verify it's working
            </Text>
          </View>

          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Troubleshooting</Text>
            <Text style={styles.helpText}>
              • Ensure both devices are on the same network{'\n'}
              • Check Windows Firewall allows Node.js{'\n'}
              • Verify the server is running on port 3001{'\n'}
              • Try accessing http://YOUR_PC_IP:3001 in a browser
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Server URL</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {serverUrl || 'Not set'}
              </Text>
            </View>
          </View>
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
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 4,
  },
  connectedInfo: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 8,
    marginLeft: 20,
  },
  inputCard: {
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  settingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  helpCard: {
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
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
    color: '#1f2937',
    maxWidth: 200,
  },
});

export default SettingsScreen;

// File length: 8,736 characters