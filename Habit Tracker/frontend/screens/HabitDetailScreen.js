import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HabitDetailScreen({ route, navigation }) {
  const { t, language } = useLanguage();
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetchHabitDetails();
    fetchCheckins();
  }, [habitId]);

  const fetchHabitDetails = async () => {
    try {
      const response = await api.get(`/habits/${habitId}`);
      setHabit(response.data);
    } catch (error) {
      Alert.alert(t('error'), t('loadingDetailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckins = async () => {
    try {
      const response = await api.get(`/habits/${habitId}/checkins`);
      setCheckins(response.data);
    } catch (error) {
      console.error('Fetch checkins error:', error);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await api.post(`/habits/${habitId}/checkin`);
      Alert.alert(t('success'), t('checkInSuccess'));
      fetchHabitDetails();
      fetchCheckins();
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
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('deleteHabit'),
      t('confirmDeleteHabit'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/habits/${habitId}`);
              Alert.alert(t('success'), t('habitDeleted'), [
                { text: t('confirm'), onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert(t('error'), t('deleteHabitFailed'));
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>{t('habitNotExist')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { borderLeftColor: habit.color || '#4CAF50' }]}>
        <Text style={styles.icon}>{habit.icon || '⭐'}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{habit.name}</Text>
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habit.streak}</Text>
          <Text style={styles.statLabel}>{t('continuousDays')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habit.totalCompletions}</Text>
          <Text style={styles.statLabel}>{t('totalCompletions')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {(() => {
              if (checkins.length === 0) return '0';
              const daysSinceStart = Math.floor((new Date() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)) + 1;
              const completionRate = Math.floor((checkins.length / daysSinceStart) * 100);
              return completionRate > 100 ? '100' : completionRate;
            })()}%
          </Text>
          <Text style={styles.statLabel}>{t('completionRate')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('startDate')}</Text>
        <Text style={styles.sectionContent}>
          {formatDate(habit.startDate)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('checkinIntervalLabel')}</Text>
        <Text style={styles.sectionContent}>
          {t('checkinIntervalEvery')} {habit.checkinInterval || 1} {habit.checkinInterval === 1 ? t('checkinIntervalDay') : t('checkinIntervalDays')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('checkInHistory')}</Text>
        {checkins.length > 0 ? (
          <View style={styles.checkinsList}>
            {checkins.slice(0, 10).map((checkin) => (
              <View key={checkin._id} style={styles.checkinItem}>
                <Text style={styles.checkinDate}>
                  {formatDate(checkin.date)}
                </Text>
              </View>
            ))}
            {checkins.length > 10 && (
              <Text style={styles.moreText}>
                {t('moreRecords', { count: checkins.length - 10 })}
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyText}>{t('noCheckInRecord')}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.checkInButton, checkingIn && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={checkingIn}
        >
          <Text style={styles.checkInButtonText}>
            {checkingIn ? t('checkingIn') : t('checkInToday')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>{t('deleteHabit')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 40,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
  },
  checkinsList: {
    marginTop: 10,
  },
  checkinItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkinDate: {
    fontSize: 16,
    color: '#666',
  },
  moreText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    padding: 20,
    paddingBottom: 40,
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

