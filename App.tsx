// App.tsx
// Path: agent-app/App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TrainerDashboard from './src/screens/TrainerDashboard';
import UserDashboard from './src/screens/UserDashboard';
import TrainerNotes from './src/screens/TrainerNotes';

import { ApiProvider } from './src/context/ApiContext';
import { AppModeProvider } from './src/context/AppModeContext';
import { DatabaseProvider } from './src/context/DatabaseContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Trainer/User specific screens
const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="TrainerNotes" component={TrainerNotes} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Root Stack Navigator (for modal screens and deep navigation)
const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Dashboard Screens (accessible from Home) */}
      <Stack.Screen 
        name="TrainerDashboard" 
        component={TrainerDashboard}
        options={{ 
          presentation: 'card',
          gestureEnabled: true 
        }}
      />
      <Stack.Screen 
        name="UserDashboard" 
        component={UserDashboard}
        options={{ 
          presentation: 'card',
          gestureEnabled: true 
        }}
      />
      
      {/* Trainer-specific Screens */}
      <Stack.Screen 
        name="TrainerNotes" 
        component={TrainerNotes}
        options={{ 
          presentation: 'card',
          gestureEnabled: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <ApiProvider>
      <AppModeProvider>
        <DatabaseProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </DatabaseProvider>
      </AppModeProvider>
    </ApiProvider>
  );
}

// File length: 2,630 characters