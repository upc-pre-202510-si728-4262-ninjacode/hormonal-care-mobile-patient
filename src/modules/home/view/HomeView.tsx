import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useHomePresenter } from '../presenter/homePresenter';

const HomeView = () => {
  const { homeState, refreshData } = useHomePresenter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString()}</Text>
      {item.doctor && <Text style={styles.cardDetail}>Doctor: {item.doctor}</Text>}
      {item.medication && <Text style={styles.cardDetail}>Medicamento: {item.medication}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Control</Text>
      
      {homeState.loading && homeState.data.length === 0 ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : homeState.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{homeState.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={homeState.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={homeState.loading}
              onRefresh={refreshData}
              colors={['#007bff']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay datos disponibles</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default HomeView;