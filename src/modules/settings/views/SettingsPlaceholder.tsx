import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { RootStackParamList } from '../../navigation/entity/navigationEntities';
import { SettingsRouter } from '../router/settingsRouter';

interface Setting {
  id: string;
  title: string;
  description: string;
  value: () => void;
}

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const settingsItems: Setting[] = [
    {
      id: '1',
      title: 'Profile',
      description: 'Manage your profile information and preferences',
      value: () => SettingsRouter.goToProfileSettings(navigation),
    },
    {
      id: '2',
      title: 'Notifications',
      description: 'Adjust your notification settings',
      value: () => SettingsRouter.goToNotificationSettings(navigation),
    },
    {
      id: '3',
      title: 'Privacy',
      description: 'Control your privacy preferences',
      value: () => SettingsRouter.goToPrivacySettings(navigation),
    },
    {
      id: '4',
      title: 'QR Code',
      description: 'View your personal QR code',
      value: () => SettingsRouter.goToQrCode(navigation),
    },
    {
      id: '5',
      title: 'Language',
      description: 'Choose your preferred language',
      value: () => SettingsRouter.goToLanguageSettings(navigation),
    },
  ];


  const renderSettingItem = ({ item }: { item: Setting }) => (
    <TouchableOpacity onPress={() => item.value()}>
      <View style={styles.notificationItem}>
        <View>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.description}</Text>
        </View>
        <SimpleLineIcons name="arrow-right" size={15} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsItems}
        renderItem={renderSettingItem}
        keyExtractor={(item: Setting) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No settings available</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937',
  },
  notificationMessage: {
    fontSize: 13,
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

export default SettingsScreen;