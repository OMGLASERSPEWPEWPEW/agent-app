// databaseService.js
// Path: agent-app/src/services/databaseService.js

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'fitness_trainer.db';
const DATABASE_VERSION = 1;

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🗄️ Initializing SQLite database...');
      
      // Open database connection
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      
      // Enable foreign keys
      await this.db.execAsync('PRAGMA foreign_keys = ON;');
      
      // Create tables
      await this.createTables();
      
      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    const tableQueries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('trainer', 'client')),
        profile_image TEXT,
        certification TEXT,
        specialties TEXT, -- JSON array
        experience INTEGER,
        philosophy TEXT,
        bio TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`,

      // Trainer notes table
      `CREATE TABLE IF NOT EXISTS trainer_notes (
        id TEXT PRIMARY KEY,
        trainer_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT, -- JSON array
        category TEXT NOT NULL CHECK (category IN ('exercise', 'nutrition', 'philosophy', 'technique', 'other')),
        is_public INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Clients table
      `CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        trainer_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        goals TEXT, -- JSON array
        restrictions TEXT, -- JSON array
        preferences TEXT, -- JSON object
        measurements TEXT, -- JSON object
        contact_info TEXT, -- JSON object
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Workouts table
      `CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        trainer_id TEXT NOT NULL,
        client_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('strength', 'cardio', 'mixed', 'flexibility', 'recovery')),
        difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        estimated_duration INTEGER,
        exercises TEXT, -- JSON array
        warmup TEXT, -- JSON array
        cooldown TEXT, -- JSON array
        tags TEXT, -- JSON array
        is_template INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
      );`,

      // Workout sessions table
      `CREATE TABLE IF NOT EXISTS workout_sessions (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        client_id TEXT NOT NULL,
        scheduled_date TEXT NOT NULL,
        completed_date TEXT,
        completed_sets TEXT, -- JSON array
        duration INTEGER,
        notes TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'skipped', 'in_progress')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      );`,

      // Goals table
      `CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'other')),
        description TEXT NOT NULL,
        target_value REAL,
        current_value REAL,
        unit TEXT,
        target_date TEXT,
        priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
        status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      );`
    ];

    for (const query of tableQueries) {
      await this.db.execAsync(query);
    }

    // Create indexes for better performance
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);',
      'CREATE INDEX IF NOT EXISTS idx_trainer_notes_trainer_id ON trainer_notes(trainer_id);',
      'CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients(trainer_id);',
      'CREATE INDEX IF NOT EXISTS idx_workouts_trainer_id ON workouts(trainer_id);',
      'CREATE INDEX IF NOT EXISTS idx_workouts_client_id ON workouts(client_id);',
      'CREATE INDEX IF NOT EXISTS idx_goals_client_id ON goals(client_id);'
    ];

    for (const query of indexQueries) {
      await this.db.execAsync(query);
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  // User operations - FIXED to accept custom ID
  async createUser(userData, customId) {
    this.ensureInitialized();
    
    const id = customId || this.generateId(); // Use custom ID if provided
    const now = this.getCurrentTimestamp();
    
    const query = `
      INSERT INTO users (id, name, email, type, profile_image, certification, specialties, experience, philosophy, bio, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      id, // Now uses custom ID if provided
      userData.name,
      userData.email || null,
      userData.type,
      userData.profileImage || null,
      userData.certification || null,
      userData.specialties ? JSON.stringify(userData.specialties) : null,
      userData.experience || null,
      userData.philosophy || null,
      userData.bio || null,
      now,
      now
    ];

    await this.db.runAsync(query, values);
    return id;
  }

  async getUser(userId) {
    this.ensureInitialized();
    
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await this.db.getFirstAsync(query, [userId]);
    
    if (result) {
      // Parse JSON fields
      if (result.specialties) {
        result.specialties = JSON.parse(result.specialties);
      }
      return result;
    }
    
    return null;
  }

  // Trainer notes operations
  async createNote(noteData) {
    this.ensureInitialized();
    
    const id = this.generateId();
    const now = this.getCurrentTimestamp();
    
    const query = `
      INSERT INTO trainer_notes (id, trainer_id, title, content, tags, category, is_public, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      id,
      noteData.trainerId,
      noteData.title,
      noteData.content,
      JSON.stringify(noteData.tags || []),
      noteData.category,
      noteData.isPublic ? 1 : 0,
      now,
      now
    ];

    await this.db.runAsync(query, values);
    return id;
  }

  async getNotes(trainerId) {
    this.ensureInitialized();
    
    const query = 'SELECT * FROM trainer_notes WHERE trainer_id = ? ORDER BY updated_at DESC';
    const results = await this.db.getAllAsync(query, [trainerId]);
    
    return results.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      isPublic: Boolean(note.is_public)
    }));
  }

  async updateNote(noteId, updates) {
    this.ensureInitialized();
    
    const now = this.getCurrentTimestamp();
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.isPublic !== undefined) {
      fields.push('is_public = ?');
      values.push(updates.isPublic ? 1 : 0);
    }
    
    fields.push('updated_at = ?');
    values.push(now);
    values.push(noteId);
    
    const query = `UPDATE trainer_notes SET ${fields.join(', ')} WHERE id = ?`;
    await this.db.runAsync(query, values);
  }

  async deleteNote(noteId) {
    this.ensureInitialized();
    
    const query = 'DELETE FROM trainer_notes WHERE id = ?';
    await this.db.runAsync(query, [noteId]);
  }

  // Client operations
  async createClient(clientData) {
    this.ensureInitialized();
    
    const id = this.generateId();
    const now = this.getCurrentTimestamp();
    
    const query = `
      INSERT INTO clients (id, trainer_id, name, email, phone, goals, restrictions, preferences, measurements, contact_info, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      id,
      clientData.trainerId,
      clientData.name,
      clientData.email || null,
      clientData.phone || null,
      JSON.stringify(clientData.goals || []),
      JSON.stringify(clientData.restrictions || []),
      JSON.stringify(clientData.preferences || {}),
      JSON.stringify(clientData.measurements || {}),
      JSON.stringify(clientData.contactInfo || {}),
      now,
      now
    ];

    await this.db.runAsync(query, values);
    return id;
  }

  async getClients(trainerId) {
    this.ensureInitialized();
    
    const query = 'SELECT * FROM clients WHERE trainer_id = ? ORDER BY name ASC';
    const results = await this.db.getAllAsync(query, [trainerId]);
    
    return results.map(client => ({
      ...client,
      goals: JSON.parse(client.goals || '[]'),
      restrictions: JSON.parse(client.restrictions || '[]'),
      preferences: JSON.parse(client.preferences || '{}'),
      measurements: JSON.parse(client.measurements || '{}'),
      contactInfo: JSON.parse(client.contact_info || '{}')
    }));
  }

  // Workout operations
  async createWorkout(workoutData) {
    this.ensureInitialized();
    
    const id = this.generateId();
    const now = this.getCurrentTimestamp();
    
    const query = `
      INSERT INTO workouts (id, trainer_id, client_id, name, description, type, difficulty, estimated_duration, exercises, warmup, cooldown, tags, is_template, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      id,
      workoutData.trainerId,
      workoutData.clientId || null,
      workoutData.name,
      workoutData.description || null,
      workoutData.type,
      workoutData.difficulty,
      workoutData.estimatedDuration || null,
      JSON.stringify(workoutData.exercises || []),
      JSON.stringify(workoutData.warmup || []),
      JSON.stringify(workoutData.cooldown || []),
      JSON.stringify(workoutData.tags || []),
      workoutData.isTemplate ? 1 : 0,
      now,
      now
    ];

    await this.db.runAsync(query, values);
    return id;
  }

  async getWorkouts(trainerId) {
    this.ensureInitialized();
    
    const query = 'SELECT * FROM workouts WHERE trainer_id = ? ORDER BY updated_at DESC';
    const results = await this.db.getAllAsync(query, [trainerId]);
    
    return results.map(workout => ({
      ...workout,
      exercises: JSON.parse(workout.exercises || '[]'),
      warmup: JSON.parse(workout.warmup || '[]'),
      cooldown: JSON.parse(workout.cooldown || '[]'),
      tags: JSON.parse(workout.tags || '[]'),
      isTemplate: Boolean(workout.is_template)
    }));
  }

  // Utility methods
  ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log('🗄️ Database connection closed');
    }
  }

  async clearAllData() {
    this.ensureInitialized();
    
    console.log('⚠️ Clearing all database data...');
    
    const tables = ['workout_sessions', 'goals', 'workouts', 'clients', 'trainer_notes', 'users'];
    
    for (const table of tables) {
      await this.db.runAsync(`DELETE FROM ${table}`);
    }
    
    console.log('✅ All data cleared');
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;

// File length: 11,108 characters