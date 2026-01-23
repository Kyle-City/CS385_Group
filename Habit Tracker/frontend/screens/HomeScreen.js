import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits?sort=recent');
      setHabits(response.data);
    } catch (error) {
      console.error('Fetch habits error:', error);
      Alert.alert(t('error'), t('loadingFailed'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHabits();
  };

  const handleCheckIn = async (habitId) => {
    try {
      await api.post(`/habits/${habitId}/checkin`);
      Alert.alert(t('success'), t('checkInSuccess'));
      fetchHabits();
    } catch (error) {
      let message = t('checkInFailed');
      if (error.response?.data?.message) {
        message = error.response.data.message;
        // If it's a check-in interval error, translate it
        if (error.response.data.daysRemaining !== undefined) {
          message = t('waitDaysBeforeCheckIn', { days: error.response.data.daysRemaining });
        }
      }
      Alert.alert(t('error'), message);
    }
  };

  const renderHabit = ({ item }) => (
    <TouchableOpacity
      style={[styles.habitCard, { borderLeftColor: item.color || '#4CAF50' }]}
      onPress={() => navigation.navigate('HabitDetail', { habitId: item._id })}
    >
      <View style={styles.habitHeader}>
        <Text style={styles.habitIcon}>{item.icon || '⭐'}</Text>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.habitStats}>
            {t('streak')} {item.streak} {t('days')} · {t('total')} {item.totalCompletions} {t('times')}
          </Text>
          <Text style={styles.habitInterval}>
            {t('checkinIntervalEvery')} {item.checkinInterval || 1} {item.checkinInterval === 1 ? t('checkinIntervalDay') : t('checkinIntervalDays')}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={() => handleCheckIn(item._id)}
      >
        <Text style={styles.checkInButtonText}>{t('checkIn')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noHabits')}</Text>
            <Text style={styles.emptySubtext}>{t('createFirstHabit')}</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateHabit')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 15,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  habitStats: {
    fontSize: 14,
    color: '#666',
  },
  habitInterval: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  checkInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
});




