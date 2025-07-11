import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AIChatModal } from '../../ai/views/AIChatModal';

const ChatScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    // Show modal when screen loads
    setModalVisible(true);
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    // Navigate back when modal is closed
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AIChatModal
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
