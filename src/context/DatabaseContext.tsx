// DatabaseContext.tsx
// Path: agent-app/src/context/DatabaseContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import databaseService from '../services/databaseService';
import { 
  DatabaseContextType, 
  User, 
  TrainerNote, 
  Client, 
  Workout 
} from '../types/fitness.types';

interface DatabaseProviderProps {
  children: ReactNode;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [currentTrainerId, setCurrentTrainerId] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async (): Promise<void> => {
    try {
      console.log('🔄 Initializing database context...');
      await databaseService.initialize();
      
      // Create default trainer account with specific ID
      const defaultId = 'default_trainer_001';
      try {
        const existingTrainer = await databaseService.getUser(defaultId);
        if (!existingTrainer) {
          // FIXED: Pass the specific ID as second parameter
          const createdId = await databaseService.createUser({
            name: 'Demo Trainer',
            email: 'demo@fitnesstrainer.app',
            type: 'trainer',
            specialties: ['Strength Training', 'Weight Loss'],
            experience: 5,
            philosophy: 'Consistent progress over perfection'
          }, defaultId); // This ensures the user is created with exactly this ID
          
          console.log('✅ Created default trainer account with ID:', createdId);
          setCurrentTrainerId(createdId);
        } else {
          console.log('✅ Default trainer account already exists');
          setCurrentTrainerId(defaultId);
        }
      } catch (userError) {
        console.log('✅ Using existing trainer account');
        setCurrentTrainerId(defaultId);
      }
      
      setIsReady(true);
      setInitializationError(null);
      console.log('✅ Database context ready');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      setInitializationError(error instanceof Error ? error.message : 'Unknown database error');
      setIsReady(false);
    }
  };

  // User operations
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<string> => {
    try {
        const userId = await databaseService.createUser(userData, customId); // Pass customId through
        console.log(`✅ User created: ${userId}`);
        return userId;
    } catch (error) {
        console.error('❌ Failed to create user:', error);
        throw new Error('Failed to create user');
    }
    };

  const getUser = async (id: string): Promise<User | null> => {
    try {
      const user = await databaseService.getUser(id);
      return user as User | null;
    } catch (error) {
      console.error('❌ Failed to get user:', error);
      throw new Error('Failed to retrieve user');
    }
  };

  // Trainer notes operations
  const createNote = async (noteData: Omit<TrainerNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const noteId = await databaseService.createNote({
        trainerId: noteData.trainerId,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        category: noteData.category,
        isPublic: noteData.isPublic
      });
      console.log(`✅ Note created: ${noteId}`);
      return noteId;
    } catch (error) {
      console.error('❌ Failed to create note:', error);
      throw new Error('Failed to create note');
    }
  };

  const getNotes = async (trainerId: string): Promise<TrainerNote[]> => {
    try {
      const notes = await databaseService.getNotes(trainerId);
      return notes.map(note => ({
        id: note.id,
        trainerId: note.trainer_id,
        title: note.title,
        content: note.content,
        tags: note.tags,
        category: note.category as TrainerNote['category'],
        isPublic: note.isPublic,
        attachments: [], // TODO: Implement attachments
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));
    } catch (error) {
      console.error('❌ Failed to get notes:', error);
      throw new Error('Failed to retrieve notes');
    }
  };

  const updateNote = async (id: string, updates: Partial<TrainerNote>): Promise<void> => {
    try {
      await databaseService.updateNote(id, updates);
      console.log(`✅ Note updated: ${id}`);
    } catch (error) {
      console.error('❌ Failed to update note:', error);
      throw new Error('Failed to update note');
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await databaseService.deleteNote(id);
      console.log(`✅ Note deleted: ${id}`);
    } catch (error) {
      console.error('❌ Failed to delete note:', error);
      throw new Error('Failed to delete note');
    }
  };

  // Client operations
  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const clientId = await databaseService.createClient({
        trainerId: clientData.trainerId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.contactInfo?.phone,
        goals: clientData.goals,
        restrictions: clientData.restrictions,
        preferences: clientData.preferences,
        measurements: clientData.measurements,
        contactInfo: clientData.contactInfo
      });
      console.log(`✅ Client created: ${clientId}`);
      return clientId;
    } catch (error) {
      console.error('❌ Failed to create client:', error);
      throw new Error('Failed to create client');
    }
  };

  const getClients = async (trainerId: string): Promise<Client[]> => {
    try {
      const clients = await databaseService.getClients(trainerId);
      return clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email || '',
        type: 'client' as const,
        trainerId: client.trainer_id,
        goals: client.goals,
        restrictions: client.restrictions,
        preferences: client.preferences,
        measurements: client.measurements,
        contactInfo: client.contactInfo,
        profileImage: client.profile_image,
        createdAt: client.created_at,
        updatedAt: client.updated_at
      }));
    } catch (error) {
      console.error('❌ Failed to get clients:', error);
      throw new Error('Failed to retrieve clients');
    }
  };

  // Workout operations
  const createWorkout = async (workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const workoutId = await databaseService.createWorkout(workoutData);
      console.log(`✅ Workout created: ${workoutId}`);
      return workoutId;
    } catch (error) {
      console.error('❌ Failed to create workout:', error);
      throw new Error('Failed to create workout');
    }
  };

  const getWorkouts = async (trainerId: string): Promise<Workout[]> => {
    try {
      const workouts = await databaseService.getWorkouts(trainerId);
      return workouts.map(workout => ({
        id: workout.id,
        trainerId: workout.trainer_id,
        clientId: workout.client_id,
        name: workout.name,
        description: workout.description,
        type: workout.type as Workout['type'],
        difficulty: workout.difficulty as Workout['difficulty'],
        estimatedDuration: workout.estimated_duration,
        exercises: workout.exercises,
        warmup: workout.warmup,
        cooldown: workout.cooldown,
        tags: workout.tags,
        isTemplate: workout.isTemplate,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at
      }));
    } catch (error) {
      console.error('❌ Failed to get workouts:', error);
      throw new Error('Failed to retrieve workouts');
    }
  };

  // Database utility operations
  const resetDatabase = async (): Promise<void> => {
    try {
      console.log('⚠️ Resetting database...');
      await databaseService.clearAllData();
      console.log('✅ Database reset complete');
    } catch (error) {
      console.error('❌ Failed to reset database:', error);
      throw new Error('Failed to reset database');
    }
  };

  const contextValue: DatabaseContextType = {
    isReady,
    initializeDatabase,
    createUser,
    getUser,
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    createClient,
    getClients,
    createWorkout,
    getWorkouts,
    currentTrainerId,
  };

  // Additional context methods for development/debugging
  const extendedContextValue = {
    ...contextValue,
    resetDatabase,
    initializationError,
    retryInitialization: initializeDatabase,
  };

  // Show initialization error state
  if (initializationError) {
    return (
      <DatabaseContext.Provider value={extendedContextValue}>
        {children}
      </DatabaseContext.Provider>
    );
  }

  // Don't render children until database is ready
  if (!isReady) {
    // Return children with limited context for loading states
    return (
      <DatabaseContext.Provider value={extendedContextValue}>
        {children}
      </DatabaseContext.Provider>
    );
  }

  return (
    <DatabaseContext.Provider value={extendedContextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Utility hooks for specific operations
export const useNotes = (trainerId: string) => {
  const { getNotes, createNote, updateNote, deleteNote } = useDatabase();
  const [notes, setNotes] = useState<TrainerNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    if (!trainerId) return;
    
    setLoading(true);
    setError(null);
    try {
      const loadedNotes = await getNotes(trainerId);
      setNotes(loadedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData: Omit<TrainerNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createNote(noteData);
      await loadNotes(); // Refresh notes list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  };

  const editNote = async (id: string, updates: Partial<TrainerNote>) => {
    try {
      await updateNote(id, updates);
      await loadNotes(); // Refresh notes list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);
      await loadNotes(); // Refresh notes list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  };

  useEffect(() => {
    loadNotes();
  }, [trainerId]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    addNote,
    editNote,
    removeNote,
  };
};

// File length: 8,192 characters