import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useProfile } from '../../../common/contexts/ProfileContext';
import { AIInteractor } from '../interactors/aiInteractor';
import { ChatMessage, CreateUserRequest, ChatAnalysisRequest } from '../entities/aiEntities';
import { ChatConversation } from '../services/aiDatabase';

interface AIChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ visible, onClose }) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiUserId, setAiUserId] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showBloodExamForm, setShowBloodExamForm] = useState(false);
  const [showConversationOptions, setShowConversationOptions] = useState(false);
  const [previousConversations, setPreviousConversations] = useState<ChatConversation[]>([]);
  const [hasAnalyzedBlood, setHasAnalyzedBlood] = useState(false); // New state to track blood analysis
  
  // Formulario específico para exámenes según la API
  const [examData, setExamData] = useState({
    glucose: '',
    cholesterol: '',
    ldl_cholesterol: '',
    hdl_cholesterol: '',
    triglycerides: '',
    hemoglobin: '',
    hematocrit: '',
    white_blood_cells: '',
    red_blood_cells: '',
    platelets: '',
    creatinine: '',
    urea: '',
    test_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  });
  
  const aiInteractor = new AIInteractor();

  useEffect(() => {
    if (visible && profile) {
      initializeChat();
    }
  }, [visible, profile]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      // Initialize database
      await aiInteractor.initializeDatabase();
      
      // Check if AI user already exists
      let storedAIUser = await aiInteractor.getStoredAIUser();
      console.log('AIChatModal: Stored AI User:', storedAIUser);
      
      if (!storedAIUser && profile) {
        // Create AI user for the first time
        console.log('AIChatModal: Creating new AI user with profile:', profile);
        const createUserData: CreateUserRequest = {
          name: profile.fullName,
          age: calculateAge(profile.birthday),
          gender: profile.gender
        };
        
        console.log('AIChatModal: Sending create user request:', createUserData);
        const response = await aiInteractor.createUser(createUserData);
        setAiUserId(response.user_id);
        console.log('AIChatModal: AI User created successfully. User ID:', response.user_id);
        
        addMessage('¡Hola! Soy tu asistente de salud hormonal. Te ayudaré a analizar tus exámenes de sangre y brindarte recomendaciones personalizadas.', false);
        addMessage('Para comenzar, necesito que agregues los resultados de tus exámenes de sangre. Haz clic en "📊 Analizar Exámenes" para empezar.', false);
        addMessage('Una vez que analice tus exámenes, podrás hacerme preguntas sobre tus resultados.', false);
      } else if (storedAIUser) {
        console.log('AIChatModal: Loading existing AI user with ID:', storedAIUser.user_id);
        setAiUserId(storedAIUser.user_id);
        
        // Check for previous conversations
        const conversations = await aiInteractor.getConversationHistory(storedAIUser.user_id);
        console.log('AIChatModal: Found conversations:', conversations.length);
        setPreviousConversations(conversations);
        
        if (conversations.length > 0) {
          setShowConversationOptions(true);
        } else {
          // No previous conversations, show welcome message
          addMessage('¡Bienvenido de vuelta! Para comenzar, necesito analizar tus exámenes de sangre.', false);
          addMessage('Haz clic en "📊 Analizar Exámenes" para agregar los resultados de tus exámenes de sangre.', false);
          addMessage('Una vez que analice tus exámenes, podrás hacerme preguntas sobre tus resultados.', false);
        }
      } else {
        console.log('AIChatModal: No profile available, cannot create AI user');
        addMessage('No se pudo inicializar el chat. Asegúrate de que tu perfil esté completo.', false);
      }
    } catch (error) {
      console.error('AIChatModal: Error initializing chat:', error);
      addMessage('Lo siento, hubo un error al inicializar el chat. Por favor, inténtalo de nuevo.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setShowConversationOptions(false);
    setHasAnalyzedBlood(false); // Reset blood analysis state
    addMessage('¡Perfecto! Vamos a iniciar un nuevo análisis de tus exámenes de sangre.', false);
    addMessage('Haz clic en "📊 Analizar Exámenes" para agregar los resultados de tus exámenes de sangre.', false);
    addMessage('Una vez que analice tus exámenes, podrás hacerme preguntas sobre tus resultados.', false);
  };

  const resumeConversation = async (conversation: ChatConversation) => {
    setIsLoading(true);
    try {
      setCurrentConversationId(conversation.conversation_id);
      setShowConversationOptions(false);
      setHasAnalyzedBlood(true); // Mark that blood has been analyzed
      
      // Load conversation messages
      const conversationMessages = await aiInteractor.getConversationMessages(conversation.conversation_id);
      
      // Convert database messages to chat messages
      const chatMessages: ChatMessage[] = conversationMessages.map(msg => ({
        id: `${msg.id}`,
        text: msg.message,
        isUser: msg.is_user,
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(chatMessages);
      
      // Add a welcome back message
      addMessage('¡Bienvenido de vuelta! Hemos cargado tu conversación anterior.', false);
      
      if (conversation.ai_explanation) {
        addMessage('Aquí tienes tu último análisis:', false);
        addMessage(conversation.ai_explanation, false);
        addMessage(`Nivel de riesgo: ${conversation.overall_risk}`, false);
      }
      
      addMessage('¿Te gustaría continuar con esta conversación o hacer alguna pregunta adicional?', false);
    } catch (error) {
      console.error('AIChatModal: Error resuming conversation:', error);
      addMessage('Hubo un error al cargar la conversación. Iniciemos una nueva.', false);
      startNewConversation();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthday: string): number => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`, // Make sure IDs are unique
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Save message to database if we have a conversation ID
    if (currentConversationId) {
      aiInteractor.saveMessage(currentConversationId, text, isUser);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    addMessage(userMessage, true);
    setInputText('');
    
    if (currentConversationId) {
      // Continue existing conversation
      setIsLoading(true);
      try {
        const response = await aiInteractor.continueConversation(currentConversationId, userMessage);
        addMessage(response.data.assistant_response, false);
      } catch (error) {
        console.error('AIChatModal: Error continuing conversation:', error);
        addMessage('Lo siento, hubo un error procesando tu mensaje. ¿Podrías repetir la pregunta?', false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simple responses for new conversations
      if (userMessage.toLowerCase().includes('examen') || userMessage.toLowerCase().includes('sangre')) {
        setTimeout(() => {
          addMessage('Me gustaría ayudarte con el análisis de tus exámenes de sangre. ¿Te gustaría agregar los resultados?', false);
        }, 1000);
      } else {
        setTimeout(() => {
          addMessage('Entiendo. ¿Podrías contarme más detalles? También puedo ayudarte a analizar exámenes de sangre si los tienes.', false);
        }, 1000);
      }
    }
  };

  const handleAnalyzeExams = async () => {
    if (!aiUserId) {
      Alert.alert('Error', 'Necesitas tener una sesión de IA activa.');
      return;
    }

    // Check if at least one exam field has a value
    const hasExamData = Object.entries(examData).some(([key, value]) => 
      key !== 'test_date' && value.trim() !== ''
    );

    if (!hasExamData) {
      Alert.alert('Error', 'Necesitas agregar al menos un valor de examen.');
      return;
    }

    setIsLoading(true);
    try {
      // Convert string values to numbers, only include fields with values
      const analysisData: ChatAnalysisRequest = {
        user_id: aiUserId,
        test_date: examData.test_date
      };

      // Add only the fields that have values
      if (examData.glucose) analysisData.glucose = parseFloat(examData.glucose);
      if (examData.cholesterol) analysisData.cholesterol = parseFloat(examData.cholesterol);
      if (examData.ldl_cholesterol) analysisData.ldl_cholesterol = parseFloat(examData.ldl_cholesterol);
      if (examData.hdl_cholesterol) analysisData.hdl_cholesterol = parseFloat(examData.hdl_cholesterol);
      if (examData.triglycerides) analysisData.triglycerides = parseFloat(examData.triglycerides);
      if (examData.hemoglobin) analysisData.hemoglobin = parseFloat(examData.hemoglobin);
      if (examData.hematocrit) analysisData.hematocrit = parseFloat(examData.hematocrit);
      if (examData.white_blood_cells) analysisData.white_blood_cells = parseFloat(examData.white_blood_cells);
      if (examData.red_blood_cells) analysisData.red_blood_cells = parseFloat(examData.red_blood_cells);
      if (examData.platelets) analysisData.platelets = parseFloat(examData.platelets);
      if (examData.creatinine) analysisData.creatinine = parseFloat(examData.creatinine);
      if (examData.urea) analysisData.urea = parseFloat(examData.urea);
      
      const response = await aiInteractor.analyzeBloodExams(analysisData);
      
      // If we got a conversation ID, store it
      if (response.data?.conversation_id) {
        setCurrentConversationId(response.data.conversation_id);
      }
      
      // Mark that blood has been analyzed
      setHasAnalyzedBlood(true);
      
      // Show the AI explanation
      if (response.data?.ai_explanation) {
        addMessage(response.data.ai_explanation, false);
      }
      
      // Show recommendations if available
      if (response.data?.analysis?.recommendations && response.data.analysis.recommendations.length > 0) {
        addMessage('📋 Recomendaciones adicionales:', false);
        response.data.analysis.recommendations.forEach(rec => {
          if (rec.description) {
            addMessage(`• Te recomiendo: ${rec.description}`, false);
          }
        });
      }
      
      // Show overall risk
      if (response.data?.analysis?.overall_risk) {
        addMessage(`📊 Nivel de riesgo general: ${response.data.analysis.overall_risk}`, false);
      }
      
      // Add message indicating they can now ask questions
      addMessage('¡Ahora ya puedes hacerme preguntas sobre tus resultados!', false);
      
      // Reset form
      setExamData({
        glucose: '',
        cholesterol: '',
        ldl_cholesterol: '',
        hdl_cholesterol: '',
        triglycerides: '',
        hemoglobin: '',
        hematocrit: '',
        white_blood_cells: '',
        red_blood_cells: '',
        platelets: '',
        creatinine: '',
        urea: '',
        test_date: new Date().toISOString().split('T')[0]
      });
      setShowBloodExamForm(false);
    } catch (error) {
      console.error('AIChatModal: Error analyzing exams:', error);
      addMessage('Lo siento, hubo un error al analizar tus exámenes. Por favor, inténtalo de nuevo.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    Alert.alert(
      'Limpiar Chat',
      '¿Estás seguro de que quieres limpiar todos los datos del chat? Esto eliminará tu historial de conversaciones.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            try {
              await aiInteractor.clearAIUser();
              setMessages([]);
              setShowBloodExamForm(false);
              setCurrentConversationId(null);
              setShowConversationOptions(false);
              setAiUserId(null);
              setPreviousConversations([]);
              setHasAnalyzedBlood(false); // Reset blood analysis state
              setExamData({
                glucose: '',
                cholesterol: '',
                ldl_cholesterol: '',
                hdl_cholesterol: '',
                triglycerides: '',
                hemoglobin: '',
                hematocrit: '',
                white_blood_cells: '',
                red_blood_cells: '',
                platelets: '',
                creatinine: '',
                urea: '',
                test_date: new Date().toISOString().split('T')[0]
              });
              
              // Reinitialize the chat
              await initializeChat();
            } catch (error) {
              console.error('Error clearing chat:', error);
              Alert.alert('Error', 'No se pudo limpiar el chat');
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CareChat</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={resetChat} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showConversationOptions && (
          <View style={styles.conversationOptionsContainer}>
            <Text style={styles.conversationOptionsTitle}>¿Qué te gustaría hacer?</Text>
            
            <TouchableOpacity
              onPress={startNewConversation}
              style={styles.conversationOptionButton}
            >
              <Text style={styles.conversationOptionText}>🆕 Iniciar nuevo análisis</Text>
            </TouchableOpacity>

            {previousConversations.length > 0 && (
              <>
                <Text style={styles.conversationHistoryTitle}>Conversaciones anteriores:</Text>
                <ScrollView style={styles.conversationHistoryList}>
                  {previousConversations.slice(0, 3).map((conversation) => (
                    <TouchableOpacity
                      key={conversation.id}
                      onPress={() => resumeConversation(conversation)}
                      style={styles.conversationHistoryItem}
                    >
                      <Text style={styles.conversationHistoryText}>
                        📊 Análisis del {new Date(conversation.created_at).toLocaleDateString()}
                      </Text>
                      <Text style={styles.conversationHistoryRisk}>
                        Riesgo: {conversation.overall_risk}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4338CA" />
              <Text style={styles.loadingText}>Procesando...</Text>
            </View>
          )}
        </ScrollView>

        {showBloodExamForm && (
          <View style={styles.examForm}>
            <Text style={styles.examFormTitle}>Agregar Exámenes de Sangre</Text>
            <ScrollView style={styles.examInputsContainer} showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.examInput}
                placeholder="Glucosa (mg/dL)"
                value={examData.glucose}
                onChangeText={(text) => setExamData(prev => ({...prev, glucose: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Colesterol total (mg/dL)"
                value={examData.cholesterol}
                onChangeText={(text) => setExamData(prev => ({...prev, cholesterol: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Colesterol LDL (mg/dL)"
                value={examData.ldl_cholesterol}
                onChangeText={(text) => setExamData(prev => ({...prev, ldl_cholesterol: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Colesterol HDL (mg/dL)"
                value={examData.hdl_cholesterol}
                onChangeText={(text) => setExamData(prev => ({...prev, hdl_cholesterol: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Triglicéridos (mg/dL)"
                value={examData.triglycerides}
                onChangeText={(text) => setExamData(prev => ({...prev, triglycerides: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Hemoglobina (g/dL)"
                value={examData.hemoglobin}
                onChangeText={(text) => setExamData(prev => ({...prev, hemoglobin: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Hematocrito (%)"
                value={examData.hematocrit}
                onChangeText={(text) => setExamData(prev => ({...prev, hematocrit: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Glóbulos blancos (/μL)"
                value={examData.white_blood_cells}
                onChangeText={(text) => setExamData(prev => ({...prev, white_blood_cells: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Glóbulos rojos (millones/μL)"
                value={examData.red_blood_cells}
                onChangeText={(text) => setExamData(prev => ({...prev, red_blood_cells: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Plaquetas (/μL)"
                value={examData.platelets}
                onChangeText={(text) => setExamData(prev => ({...prev, platelets: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Creatinina (mg/dL)"
                value={examData.creatinine}
                onChangeText={(text) => setExamData(prev => ({...prev, creatinine: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Urea (mg/dL)"
                value={examData.urea}
                onChangeText={(text) => setExamData(prev => ({...prev, urea: text}))}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.examInput}
                placeholder="Fecha del examen (YYYY-MM-DD)"
                value={examData.test_date}
                onChangeText={(text) => setExamData(prev => ({...prev, test_date: text}))}
              />
            </ScrollView>
            
            <View style={styles.examButtonsRow}>
              <TouchableOpacity onPress={handleAnalyzeExams} style={styles.analyzeButton}>
                <Text style={styles.buttonText}>Analizar Exámenes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowBloodExamForm(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={() => setShowBloodExamForm(true)}
              style={styles.quickActionButton}
            >
              <Text style={styles.quickActionText}>📊 Analizar Exámenes</Text>
            </TouchableOpacity>
          </View>
          
          {!showConversationOptions && hasAnalyzedBlood && (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Escribe tu mensaje..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                disabled={!inputText.trim()}
              >
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!showConversationOptions && !hasAnalyzedBlood && (
            <View style={styles.disabledInputContainer}>
              <Text style={styles.disabledInputText}>
                Primero debes analizar tus exámenes de sangre para poder enviar mensajes
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4338CA',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    padding: 8,
    marginRight: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationOptionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  conversationOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  conversationOptionButton: {
    backgroundColor: '#4338CA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  conversationOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  conversationHistoryList: {
    maxHeight: 200,
  },
  conversationHistoryItem: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4338CA',
  },
  conversationHistoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  conversationHistoryRisk: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#374151',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#6b7280',
  },
  examForm: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    maxHeight: 400,
  },
  examInputsContainer: {
    maxHeight: 250,
  },
  examFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  examInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  examButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addExamButton: {
    flex: 1,
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  examsList: {
    marginTop: 16,
  },
  examsListTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  examItem: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 4,
  },
  analyzeButton: {
    backgroundColor: '#4338CA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  quickActions: {
    marginBottom: 12,
  },
  quickActionButton: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#4338CA',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledInputContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  disabledInputText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
