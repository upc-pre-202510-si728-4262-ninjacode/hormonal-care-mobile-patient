import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define a type for the notification item
interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

// Sample notification data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'You have an appointment scheduled tomorrow at 10:00 AM',
    date: '2 hours ago',
  },
  {
    id: '2',
    title: 'Message from Dr. Smith',
    message: 'Your lab results are ready for review',
    date: '1 day ago',
  },
  {
    id: '3',
    title: 'Prescription Refill',
    message: 'Your prescription is ready for pickup',
    date: '3 days ago',
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sampleNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item: Notification) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications at this time</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default NotificationsScreen;