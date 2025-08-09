// fitness.types.ts
// Path: agent-app/src/types/fitness.types.ts

// App Mode Types
export type AppMode = 'trainer' | 'user';

export interface AppModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isTrainer: boolean;
  isUser: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'trainer' | 'client';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer extends User {
  type: 'trainer';
  certification?: string;
  specialties: string[];
  experience: number; // years
  philosophy?: string;
  bio?: string;
}

export interface Client extends User {
  type: 'client';
  trainerId: string;
  goals: Goal[];
  restrictions: string[];
  preferences: ClientPreferences;
  measurements: Measurements;
  contactInfo: ContactInfo;
}

// Goals and Tracking
export interface Goal {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'other';
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

// Client Information
export interface ClientPreferences {
  workoutDays: string[]; // ['monday', 'wednesday', 'friday']
  workoutTime: 'morning' | 'afternoon' | 'evening';
  workoutDuration: number; // minutes
  equipment: string[];
  location: 'gym' | 'home' | 'both';
  intensity: 'low' | 'moderate' | 'high';
}

export interface Measurements {
  height?: number; // cm
  weight?: number; // kg
  bodyFat?: number; // percentage
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  lastUpdated: string;
}

export interface ContactInfo {
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Notes and Content
export interface TrainerNote {
  id: string;
  trainerId: string;
  title: string;
  content: string;
  tags: string[];
  category: 'exercise' | 'nutrition' | 'philosophy' | 'technique' | 'other';
  isPublic: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  filename: string;
  size: number; // bytes
  mimeType: string;
}

// Workout Types
export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'core';
  muscleGroups: string[];
  equipment: string[];
  instructions: string;
  safetyNotes?: string;
  modifications?: string[];
  videoUrl?: string;
}

export interface WorkoutSet {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // seconds
  distance?: number; // meters
  restTime?: number; // seconds
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
}

export interface Workout {
  id: string;
  trainerId: string;
  clientId?: string;
  name: string;
  description?: string;
  type: 'strength' | 'cardio' | 'mixed' | 'flexibility' | 'recovery';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // minutes
  exercises: WorkoutSet[];
  warmup?: WorkoutSet[];
  cooldown?: WorkoutSet[];
  tags: string[];
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  trainerId: string;
  clientId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  workouts: Workout[];
  goals: string[]; // Goal IDs
  status: 'draft' | 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// Progress Tracking
export interface WorkoutSession {
  id: string;
  workoutId: string;
  clientId: string;
  scheduledDate: string;
  completedDate?: string;
  completedSets: WorkoutSet[];
  duration?: number; // actual duration in minutes
  notes?: string;
  rating?: number; // 1-5 stars
  status: 'scheduled' | 'completed' | 'skipped' | 'in_progress';
}

// Database Types
export interface DatabaseConfig {
  name: string;
  version: number;
}

export interface DatabaseContextType {
  isReady: boolean;
  initializeDatabase: () => Promise<void>;
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getUser: (id: string) => Promise<User | null>;
  createNote: (note: Omit<TrainerNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getNotes: (trainerId: string) => Promise<TrainerNote[]>;
  updateNote: (id: string, updates: Partial<TrainerNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getClients: (trainerId: string) => Promise<Client[]>;
  createWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getWorkouts: (trainerId: string) => Promise<Workout[]>;
  currentTrainerId: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  disabled?: boolean;
}

export interface NotesEditorProps {
  note?: TrainerNote;
  onSave: (note: Omit<TrainerNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Chat: { initialMessage?: string };
  Settings: undefined;
  TrainerDashboard: undefined;
  UserDashboard: undefined;
  TrainerNotes: undefined;
  NoteEditor: { noteId?: string };
  ClientDetails: { clientId: string };
  WorkoutPlanner: { clientId?: string };
  
};

// File length: 6,024 characters