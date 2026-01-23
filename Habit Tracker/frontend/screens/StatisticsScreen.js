import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80; // 左右各留40px边距
const CHART_HEIGHT = 300;
const BAR_HEIGHT = 30;
const BAR_SPACING = 10;
const MIN_BAR_WIDTH = 20; // 最小条形宽度（像素）
const ICON_AREA_WIDTH = 60; // 图标区域宽度

export default function StatisticsScreen(props) {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [completionStats, setCompletionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompletionStats = async () => {
    try {
      const response = await api.get('/stats/weekly');
      setCompletionStats(response.data || []);
    } catch (error) {
      console.error('Fetch completion stats error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompletionStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompletionStats();
  };

  const renderBarChart = () => {
    if (!completionStats || completionStats.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noStatisticsData')}</Text>
        </View>
      );
    }

    // Calculate max ratio for scaling
    const maxRatio = Math.max(...completionStats.map((stat) => stat.ratio), 0.1);
    const maxBarWidth = CHART_WIDTH - ICON_AREA_WIDTH - 80; // Leave space for icon and percentage text

    // Calculate total height needed
    const totalHeight = completionStats.length * (BAR_HEIGHT + BAR_SPACING) + 40;

    return (
      <View style={styles.chartWrapper}>
        <Svg width={CHART_WIDTH} height={Math.max(CHART_HEIGHT, totalHeight)}>
          {completionStats.map((stat, index) => {
            const barWidth = Math.max(
              MIN_BAR_WIDTH,
              (stat.ratio / maxRatio) * maxBarWidth
            );
            const yPosition = index * (BAR_HEIGHT + BAR_SPACING) + 20;
            const barColor = stat.color || '#4CAF50';
            const percentage = (stat.ratio * 100).toFixed(0);

            return (
              <React.Fragment key={stat.habitId}>
                {/* Bar background (gray) */}
                <Rect
                  x={ICON_AREA_WIDTH}
                  y={yPosition}
                  width={maxBarWidth}
                  height={BAR_HEIGHT}
                  fill="#e0e0e0"
                  rx={4}
                />

                {/* Bar foreground (colored) */}
                <Rect
                  x={ICON_AREA_WIDTH}
                  y={yPosition}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  fill={barColor}
                  rx={4}
                />

                {/* Percentage text - always show on the right side of the bar */}
                <SvgText
                  x={ICON_AREA_WIDTH + maxBarWidth + 10}
                  y={yPosition + BAR_HEIGHT / 2}
                  fontSize={13}
                  fill="#333"
                  fontWeight="bold"
                  alignmentBaseline="middle"
                >
                  {percentage}%
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
        {/* Icon buttons (outside SVG for better touch handling) */}
        {completionStats.map((stat, index) => {
          const yPosition = index * (BAR_HEIGHT + BAR_SPACING) + 20;
          const percentage = (stat.ratio * 100).toFixed(0);
          
          return (
            <TouchableOpacity
              key={`icon-${stat.habitId}`}
              style={[
                styles.iconButton,
                {
                  top: yPosition + BAR_HEIGHT / 2 - 15,
                },
              ]}
              onPress={() => navigation.navigate('HabitDetail', { habitId: stat.habitId })}
              activeOpacity={0.7}
            >
              <Text style={styles.iconText}>{stat.icon}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('completionStatistics')}</Text>
          <Text style={styles.subtitle}>{t('completionStatisticsDesc')}</Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{t('habitCompletionRate')}</Text>
          </View>
          {renderBarChart()}
        </View>
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
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartWrapper: {
    width: '100%',
    minHeight: CHART_HEIGHT,
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    left: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 24,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

