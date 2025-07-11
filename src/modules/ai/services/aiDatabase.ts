import * as SQLite from 'expo-sqlite';

export interface ChatUser {
  id?: number;
  ai_user_id: string;
  name: string;
  age: number;
  gender: string;
  created_at: string;
}

export interface ChatConversation {
  id?: number;
  conversation_id: string;
  ai_user_id: string;
  blood_test_id?: string;
  analysis_data?: string; // JSON string
  ai_explanation?: string;
  overall_risk?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: number;
  conversation_id: string;
  message: string;
  is_user: boolean;
  timestamp: string;
}

class AIDatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('ai_chat.db');
      
      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS chat_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ai_user_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          conversation_id TEXT UNIQUE NOT NULL,
          ai_user_id TEXT NOT NULL,
          blood_test_id TEXT,
          analysis_data TEXT,
          ai_explanation TEXT,
          overall_risk TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (ai_user_id) REFERENCES chat_users (ai_user_id)
        );
        
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          conversation_id TEXT NOT NULL,
          message TEXT NOT NULL,
          is_user BOOLEAN NOT NULL,
          timestamp TEXT NOT NULL,
          FOREIGN KEY (conversation_id) REFERENCES chat_conversations (conversation_id)
        );
      `);
      
      console.log('AI Database initialized successfully');
    } catch (error) {
      console.error('Error initializing AI database:', error);
      throw error;
    }
  }

  async saveUser(user: ChatUser): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO chat_users (ai_user_id, name, age, gender, created_at) VALUES (?, ?, ?, ?, ?)',
        [user.ai_user_id, user.name, user.age, user.gender, user.created_at]
      );
      console.log('AI User saved to database:', user.ai_user_id);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<ChatUser | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getFirstAsync<ChatUser>(
        'SELECT * FROM chat_users ORDER BY created_at DESC LIMIT 1'
      );
      return result || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async saveConversation(conversation: ChatConversation): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO chat_conversations (conversation_id, ai_user_id, blood_test_id, analysis_data, ai_explanation, overall_risk, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          conversation.conversation_id,
          conversation.ai_user_id,
          conversation.blood_test_id || null,
          conversation.analysis_data || null,
          conversation.ai_explanation || null,
          conversation.overall_risk || null,
          conversation.created_at,
          conversation.updated_at
        ]
      );
      console.log('Conversation saved to database:', conversation.conversation_id);
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }

  async getConversations(ai_user_id: string): Promise<ChatConversation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getAllAsync<ChatConversation>(
        'SELECT * FROM chat_conversations WHERE ai_user_id = ? ORDER BY updated_at DESC',
        [ai_user_id]
      );
      return result || [];
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async getLatestConversation(ai_user_id: string): Promise<ChatConversation | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getFirstAsync<ChatConversation>(
        'SELECT * FROM chat_conversations WHERE ai_user_id = ? ORDER BY updated_at DESC LIMIT 1',
        [ai_user_id]
      );
      return result || null;
    } catch (error) {
      console.error('Error getting latest conversation:', error);
      return null;
    }
  }

  async saveMessage(message: ChatMessage): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync(
        'INSERT INTO chat_messages (conversation_id, message, is_user, timestamp) VALUES (?, ?, ?, ?)',
        [message.conversation_id, message.message, message.is_user, message.timestamp]
      );
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async getMessages(conversation_id: string): Promise<ChatMessage[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getAllAsync<ChatMessage>(
        'SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY timestamp ASC',
        [conversation_id]
      );
      return result || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.execAsync(`
        DELETE FROM chat_messages;
        DELETE FROM chat_conversations;
        DELETE FROM chat_users;
      `);
      console.log('All AI chat data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const aiDatabase = new AIDatabaseService();
