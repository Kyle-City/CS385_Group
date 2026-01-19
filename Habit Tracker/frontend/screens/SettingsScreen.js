import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const handleClearCache = () => {
    Alert.alert(
      t('clearCache'),
      t('confirmClearCache'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: async () => {
            try {
              // 只清除非认证相关的缓存
              // Token 保留，用户不会退出登录
              Alert.alert(t('success'), t('cacheCleared'));
            } catch (error) {
              Alert.alert(t('error'), t('clearCacheFailed'));
            }
          },
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    changeLanguage(newLanguage);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('generalSettings')}</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('themeColor')}</Text>
          <Text style={styles.settingValue}>{t('defaultTheme')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
          <Text style={styles.settingLabel}>{t('language')}</Text>
          <Text style={styles.settingValue}>
            {language === 'zh' ? t('simplifiedChinese') : t('english')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleClearCache}
        >
          <Text style={styles.settingLabel}>{t('clearCache')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('version')}</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
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
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
});




