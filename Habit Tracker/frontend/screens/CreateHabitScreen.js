import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];
const ICONS = ['⭐', '💪', '📚', '🏃', '🎯', '🧘', '💧', '🍎'];

export default function CreateHabitScreen({ navigation }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [checkinInterval, setCheckinInterval] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert(t('error'), t('enterHabitName'));
      return;
    }

    if (checkinInterval < 1 || !Number.isInteger(checkinInterval)) {
      Alert.alert(t('error'), t('checkinIntervalMinError'));
      return;
    }

    setLoading(true);
    try {
      await api.post('/habits/create', {
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
        icon: selectedIcon,
        checkinInterval: checkinInterval,
      });
      
      Alert.alert(t('success'), t('habitCreated'), [
        { text: t('confirm'), onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(t('error'), error.response?.data?.message || t('createHabitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleIntervalChange = (value) => {
    // 允许空字符串用于编辑
    if (value === '') {
      setCheckinInterval('');
      return;
    }
    const numValue = parseInt(value);
    // 只接受有效的正整数
    if (!isNaN(numValue) && numValue >= 1) {
      setCheckinInterval(numValue);
    }
  };

  const handleIntervalBlur = () => {
    // 如果输入为空或无效，重置为1
    if (checkinInterval === '' || checkinInterval < 1 || !Number.isInteger(checkinInterval)) {
      setCheckinInterval(1);
    }
  };

  const incrementInterval = () => {
    setCheckinInterval((prev) => {
      const current = prev || 1;
      return current + 1;
    });
  };

  const decrementInterval = () => {
    setCheckinInterval((prev) => {
      const current = prev || 1;
      return Math.max(1, current - 1);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.label}>{t('habitName')} *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('createHabitExample')}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('addDescription')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>{t('selectColor')}</Text>
          <View style={styles.colorContainer}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <Text style={styles.label}>{t('selectIcon')}</Text>
          <View style={styles.iconContainer}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('checkinInterval')}</Text>
          <View style={styles.intervalContainer}>
            <TouchableOpacity
              style={styles.intervalButton}
              onPress={decrementInterval}
            >
              <Text style={styles.intervalButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.intervalInputContainer}>
              <TextInput
                style={styles.intervalInput}
                value={checkinInterval === '' ? '' : checkinInterval.toString()}
                onChangeText={handleIntervalChange}
                onBlur={handleIntervalBlur}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <Text style={styles.intervalLabel}>
                {t('checkinIntervalDesc')} {checkinInterval || 1} {t('checkinIntervalDays')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.intervalButton}
              onPress={incrementInterval}
            >
              <Text style={styles.intervalButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>{t('preview')}</Text>
            <View style={[styles.previewCard, { borderLeftColor: selectedColor }]}>
              <Text style={styles.previewIcon}>{selectedIcon}</Text>
              <Text style={styles.previewName}>{name || t('habitName')}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('creating') : t('createHabit')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  iconText: {
    fontSize: 24,
  },
  preview: {
    marginTop: 20,
    marginBottom: 30,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  previewIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  intervalButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intervalButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  intervalInputContainer: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  intervalInput: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  intervalLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});


