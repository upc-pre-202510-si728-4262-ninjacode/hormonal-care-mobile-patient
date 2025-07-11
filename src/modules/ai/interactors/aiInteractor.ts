import { aiApiClient } from '../config/aiApi';
import {
  CreateUserRequest,
  CreateUserResponse,
  ChatAnalysisRequest,
  ChatAnalysisResponse,
  ChatMessageResponse,
  UserAIData
} from '../entities/aiEntities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aiDatabase, ChatUser, ChatConversation, ChatMessage } from '../services/aiDatabase';

export class AIInteractor {
  private readonly AI_USER_KEY = 'ai_user_data';

  async initializeDatabase(): Promise<void> {
    await aiDatabase.initDatabase();
  }

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log('AIInteractor: Creating user in AI:', userData);
      const response = await aiApiClient.post('/api/users', userData);
      
      console.log('AI API Response:', response.status, response.data);
      
      // The API returns 'id' instead of 'user_id'
      const userId = response.data.data?.id || response.data.id;
      
      if (!userId) {
        throw new Error('No user ID returned from API');
      }
      
      // Save AI user data locally in both AsyncStorage and SQLite
      const aiUserData: UserAIData = {
        user_id: userId,
        created_at: new Date().toISOString()
      };
      
      // Save to AsyncStorage (legacy support)
      await AsyncStorage.setItem(this.AI_USER_KEY, JSON.stringify(aiUserData));
      
      // Save to SQLite
      const chatUser: ChatUser = {
        ai_user_id: userId,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        created_at: new Date().toISOString()
      };
      await aiDatabase.saveUser(chatUser);
      
      console.log('AIInteractor: User created and saved locally:', aiUserData);
      
      return {
        user_id: userId,
        message: response.data.message || 'Usuario creado exitosamente'
      };
    } catch (error) {
      console.error('AIInteractor: Error creating user:', error);
      throw error;
    }
  }

  async getStoredAIUser(): Promise<UserAIData | null> {
    try {
      // First try to get from SQLite
      const chatUser = await aiDatabase.getUser();
      if (chatUser) {
        return {
          user_id: chatUser.ai_user_id,
          created_at: chatUser.created_at
        };
      }
      
      // Fallback to AsyncStorage
      const data = await AsyncStorage.getItem(this.AI_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('AIInteractor: Error getting stored AI user:', error);
      return null;
    }
  }

  async analyzeBloodExams(request: ChatAnalysisRequest): Promise<ChatAnalysisResponse> {
    try {
      console.log('AIInteractor: Analyzing blood exams:', request);
      const response = await aiApiClient.post<ChatAnalysisResponse>('/api/chat/analyze', request);
      console.log('AIInteractor: Blood analysis response:', response.data);
      
      // Save the conversation to SQLite
      if (response.data.data?.conversation_id) {
        const conversation: ChatConversation = {
          conversation_id: response.data.data.conversation_id,
          ai_user_id: request.user_id,
          blood_test_id: response.data.data.blood_test_id,
          analysis_data: JSON.stringify(request),
          ai_explanation: response.data.data.ai_explanation,
          overall_risk: response.data.data.analysis.overall_risk,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await aiDatabase.saveConversation(conversation);
        console.log('AIInteractor: Conversation saved to database');
      }
      
      return response.data;
    } catch (error) {
      console.error('AIInteractor: Error analyzing blood exams:', error);
      throw error;
    }
  }

  async getConversationHistory(userId: string): Promise<ChatConversation[]> {
    try {
      return await aiDatabase.getConversations(userId);
    } catch (error) {
      console.error('AIInteractor: Error getting conversation history:', error);
      return [];
    }
  }

  async getLatestConversation(userId: string): Promise<ChatConversation | null> {
    try {
      return await aiDatabase.getLatestConversation(userId);
    } catch (error) {
      console.error('AIInteractor: Error getting latest conversation:', error);
      return null;
    }
  }

  async saveMessage(conversationId: string, message: string, isUser: boolean): Promise<void> {
    try {
      const chatMessage: ChatMessage = {
        conversation_id: conversationId,
        message: message,
        is_user: isUser,
        timestamp: new Date().toISOString()
      };
      await aiDatabase.saveMessage(chatMessage);
    } catch (error) {
      console.error('AIInteractor: Error saving message:', error);
    }
  }

  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      return await aiDatabase.getMessages(conversationId);
    } catch (error) {
      console.error('AIInteractor: Error getting conversation messages:', error);
      return [];
    }
  }

  async continueConversation(conversationId: string, message: string): Promise<ChatMessageResponse> {
    try {
      console.log('AIInteractor: Continuing conversation:', conversationId, message);
      const response = await aiApiClient.post<ChatMessageResponse>(`/api/chat/${conversationId}/message`, {
        message: message
      });
      console.log('AIInteractor: Continue conversation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('AIInteractor: Error continuing conversation:', error);
      throw error;
    }
  }

  async clearAIUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AI_USER_KEY);
      await aiDatabase.clearAllData();
      console.log('AIInteractor: AI user data cleared');
    } catch (error) {
      console.error('AIInteractor: Error clearing AI user:', error);
    }
  }
}
