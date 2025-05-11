import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  userType: 'doctor' | 'nurse' | 'admin' | 'pharmacist' | 'patient';
  avatar?: string;
  unread?: boolean;
}

const getMessages = async (): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          content: 'Hello, how are you feeling today? Have your symptoms improved since our last appointment?', 
          sender: 'Dr. Smith', 
          timestamp: '2025-05-10T10:30:00',
          userType: 'doctor',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          unread: true
        },
        { 
          id: 2, 
          content: 'Your prescription has been sent to the pharmacy. You can pick it up this afternoon.', 
          sender: 'Nurse Garcia', 
          timestamp: '2025-05-09T15:45:00',
          userType: 'nurse',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
        },
        { 
          id: 3, 
          content: 'Your test results have arrived. Let\'s discuss them at your next appointment.', 
          sender: 'Dr. Johnson', 
          timestamp: '2025-05-08T09:15:00',
          userType: 'doctor',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 4,
          content: 'Your appointment on May 15th has been confirmed. Please arrive 15 minutes early to complete paperwork.',
          sender: 'Admin Support',
          timestamp: '2025-05-07T11:20:00',
          userType: 'admin',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        {
          id: 5,
          content: 'Your medication is ready for pickup. We close at 8 PM today.',
          sender: 'Central Pharmacy',
          timestamp: '2025-05-06T14:30:00',
          userType: 'pharmacist',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
      ]);
    }, 1000);
  });
};

const MessagesPlaceholder = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const response = await getMessages();
      setMessages(response);
    } catch (err) {
      setError('Error fetching messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const formatDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get user type color and icon
  const getUserTypeStyles = (userType: string) => {
    switch(userType) {
      case 'doctor':
        return { 
          color: '#4285F4', 
          icon: 'medical-outline',
          indicator: styles.doctorIndicator
        };
      case 'nurse':
        return { 
          color: '#0F9D58', 
          icon: 'fitness-outline',
          indicator: styles.nurseIndicator
        };
      case 'admin':
        return { 
          color: '#9C27B0', 
          icon: 'calendar-outline',
          indicator: styles.adminIndicator
        };
      case 'pharmacist':
        return { 
          color: '#F4B400', 
          icon: 'medkit-outline',
          indicator: styles.pharmacistIndicator
        };
      default:
        return { 
          color: '#757575', 
          icon: 'person-outline',
          indicator: styles.patientIndicator
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff4d4f" />
          <Text style={[styles.errorText, { color: '#ff4d4f' }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMessages}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (messages.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Ionicons name="chatbubble-ellipses-outline" size={80} color="#d3d3d3" />
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>Your conversations with healthcare providers will appear here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const userStyles = getUserTypeStyles(item.userType);
            
            return (
              <TouchableOpacity 
                style={[styles.messageItem, item.unread && styles.unreadMessage]}
              >
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: item.avatar || 'https://via.placeholder.com/50' }} 
                    style={styles.avatar} 
                  />
                  <View style={[styles.userTypeIndicator, userStyles.indicator]} />
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.sender}>{item.sender}</Text>
                    <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                  </View>
                  <Text style={[styles.content, item.unread && styles.unreadContent]} numberOfLines={2}>
                    {item.content}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  {item.unread && <View style={styles.unreadDot} />}
                  <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 5,
  },
  listContent: {
    paddingBottom: 80,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  unreadMessage: {
    backgroundColor: '#f8f4ff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userTypeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  doctorIndicator: {
    backgroundColor: '#4285F4',
  },
  nurseIndicator: {
    backgroundColor: '#0F9D58',
  },
  adminIndicator: {
    backgroundColor: '#9C27B0',
  },
  pharmacistIndicator: {
    backgroundColor: '#F4B400',
  },
  patientIndicator: {
    backgroundColor: '#757575',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadContent: {
    color: '#333',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200ee',
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 88,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MessagesPlaceholder;