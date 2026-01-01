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

export default function HabitDetailScreen({ route, navigation }) {
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
      Alert.alert('错误', '加载习惯详情失败');
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
      Alert.alert('成功', '打卡成功！');
      fetchHabitDetails();
      fetchCheckins();
    } catch (error) {
      const message = error.response?.data?.message || '打卡失败';
      Alert.alert('错误', message);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '删除习惯',
      '确定要删除这个习惯吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/habits/${habitId}`);
              Alert.alert('成功', '习惯已删除', [
                { text: '确定', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('错误', '删除习惯失败');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
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
        <Text>习惯不存在</Text>
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
          <Text style={styles.statLabel}>连续天数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habit.totalCompletions}</Text>
          <Text style={styles.statLabel}>总完成次数</Text>
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
          <Text style={styles.statLabel}>完成率</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>开始日期</Text>
        <Text style={styles.sectionContent}>
          {formatDate(habit.startDate)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>打卡记录</Text>
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
                还有 {checkins.length - 10} 条记录...
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyText}>还没有打卡记录</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.checkInButton, checkingIn && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={checkingIn}
        >
          <Text style={styles.checkInButtonText}>
            {checkingIn ? '打卡中...' : '今日打卡'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>删除习惯</Text>
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

