// TrainerNotes.tsx
// Path: agent-app/src/screens/TrainerNotes.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase, useNotes } from '../context/DatabaseContext';
import { TrainerNote } from '../types/fitness.types';

interface TrainerNotesProps {
  navigation: any;
}

const TrainerNotes: React.FC<TrainerNotesProps> = ({ navigation }) => {
  const { isReady, currentTrainerId } = useDatabase();
  
  // Use the current trainer ID from context
  const CURRENT_TRAINER_ID = currentTrainerId || 'default_trainer_001';
  
  const {
    notes,
    loading,
    error,
    loadNotes,
    addNote,
    editNote,
    removeNote
  } = useNotes(CURRENT_TRAINER_ID);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<TrainerNote['category']>('exercise');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { key: 'all', label: 'All Notes', icon: 'list' },
    { key: 'exercise', label: 'Exercise', icon: 'fitness' },
    { key: 'nutrition', label: 'Nutrition', icon: 'nutrition' },
    { key: 'philosophy', label: 'Philosophy', icon: 'bulb' },
    { key: 'technique', label: 'Technique', icon: 'settings' },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      await addNote({
        trainerId: CURRENT_TRAINER_ID,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        category: newNoteCategory,
        tags: [], // TODO: Add tag input
        isPublic: false,
        attachments: [],
      });

      // Reset form
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteCategory('exercise');
      setIsCreating(false);

      Alert.alert('Success', 'Note created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create note');
    }
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeNote(noteId);
              Alert.alert('Success', 'Note deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        }
      ]
    );
  };

  const handleEditNote = (note: TrainerNote) => {
    Alert.alert(
      'Edit Note',
      'Note editing will be available in the next update!',
      [{ text: 'OK' }]
    );
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat ? cat.icon : 'document-text';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading training notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Training Notes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsCreating(true)}
          >
            <Ionicons name="add" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                selectedCategory === category.key && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.key ? '#ffffff' : '#6b7280'}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.key && styles.selectedCategoryChipText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Create Note Form */}
      {isCreating && (
        <View style={styles.createNoteContainer}>
          <View style={styles.createNoteHeader}>
            <Text style={styles.createNoteTitle}>Create New Note</Text>
            <TouchableOpacity onPress={() => setIsCreating(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Note title..."
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
            placeholderTextColor="#9ca3af"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categorySelector}
          >
            {categories.slice(1).map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categorySelectorChip,
                  newNoteCategory === category.key && styles.selectedCategorySelectorChip
                ]}
                onPress={() => setNewNoteCategory(category.key as TrainerNote['category'])}
              >
                <Text style={[
                  styles.categorySelectorText,
                  newNoteCategory === category.key && styles.selectedCategorySelectorText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={styles.contentInput}
            placeholder="Write your training note here..."
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />

          <View style={styles.createNoteActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsCreating(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleCreateNote}
            >
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes List */}
      <ScrollView
        style={styles.notesContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadNotes}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : getFilteredNotes().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>
              {searchQuery || selectedCategory !== 'all' ? 'No matching notes' : 'No notes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Create your first training note to get started'
              }
            </Text>
            {!searchQuery && selectedCategory === 'all' && (
              <TouchableOpacity
                style={styles.createFirstNoteButton}
                onPress={() => setIsCreating(true)}
              >
                <Text style={styles.createFirstNoteButtonText}>Create Note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          getFilteredNotes().map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteHeaderLeft}>
                  <Ionicons
                    name={getCategoryIcon(note.category) as any}
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.noteTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                </View>
                <View style={styles.noteActions}>
                  <TouchableOpacity
                    style={styles.noteActionButton}
                    onPress={() => handleEditNote(note)}
                  >
                    <Ionicons name="pencil" size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.noteActionButton}
                    onPress={() => handleDeleteNote(note.id, note.title)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.noteContent} numberOfLines={3}>
                {note.content}
              </Text>

              <View style={styles.noteFooter}>
                <View style={styles.noteMetadata}>
                  <Text style={styles.noteCategory}>{note.category}</Text>
                  <Text style={styles.noteDate}>{formatDate(note.updatedAt)}</Text>
                </View>
                {note.tags.length > 0 && (
                  <View style={styles.noteTags}>
                    {note.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.noteTag}>
                        <Text style={styles.noteTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
    marginRight: 8,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#ffffff',
  },
  createNoteContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createNoteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  categorySelector: {
    marginBottom: 12,
  },
  categorySelectorChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategorySelectorChip: {
    backgroundColor: '#3b82f6',
  },
  categorySelectorText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedCategorySelectorText: {
    color: '#ffffff',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 120,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  createNoteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstNoteButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstNoteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  noteActionButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteCategory: {
    fontSize: 12,
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  noteDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noteTags: {
    flexDirection: 'row',
    gap: 4,
  },
  noteTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noteTagText: {
    fontSize: 11,
    color: '#6b7280',
  },
});

export default TrainerNotes;

// File length: 15,386 characters