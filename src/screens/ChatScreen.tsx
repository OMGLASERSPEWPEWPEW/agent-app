// ChatScreen.tsx
// Path: agent-app/src/screens/ChatScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../context/ApiContext';
import { useRoute } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatScreenRouteParams {
  initialMessage?: string;
}

const ChatScreen: React.FC = () => {
  const { sendMessage, isConnected, isLoading } = useApi();
  const route = useRoute();
  const { initialMessage } = (route.params as ChatScreenRouteParams) || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    addMessage("Hello! I'm your AI assistant. How can I help you today?", false);
    
    // Send initial message if provided
    if (initialMessage) {
      setInputText(initialMessage);
      setTimeout(() => handleSend(initialMessage), 500);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, isLoading: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
      isLoading,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId: string, text: string, isLoading: boolean = false) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, text, isLoading }
        : msg
    ));
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    
    if (!textToSend) return;
    
    if (!isConnected) {
      Alert.alert(
        'Not Connected',
        'Please check your server connection in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Clear input and add user message
    setInputText('');
    addMessage(textToSend, true);

    // Add loading message for AI response
    const loadingMessageId = addMessage('Thinking...', false, true);

    try {
      const response = await sendMessage(textToSend);
      updateMessage(loadingMessageId, response);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Network error - please check your connection.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error - the AI service might be unavailable.';
        }
      }
      
      updateMessage(loadingMessageId, errorMessage);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            addMessage("Hello! I'm your AI assistant. How can I help you today?", false);
          }
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                {message.isLoading && (
                  <View style={styles.loadingIndicator}>
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                  </View>
                )}
              </View>
              <Text style={styles.timestamp}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={1000}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || !isConnected || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || !isConnected || isLoading}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={20} color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          
          {!isConnected && (
            <View style={styles.disconnectedBanner}>
              <Ionicons name="wifi-outline" size={16} color="#ef4444" />
              <Text style={styles.disconnectedText}>
                Not connected to server
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    padding: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1f2937',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6b7280',
    marginRight: 4,
    opacity: 0.4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  disconnectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  disconnectedText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default ChatScreen;

// File length: 9,341 characters