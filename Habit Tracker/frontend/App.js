import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet, Image, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CreateHabitScreen from './screens/CreateHabitScreen';
import HabitDetailScreen from './screens/HabitDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// 导入导航栏图标
const habitClicked = require('./assets/habit_clicked.png');
const habitUnclicked = require('./assets/habit_unclicked.png');
const individualClicked = require('./assets/individual_clicked.png');
const individualUnclicked = require('./assets/individual_unclicked.png');
const settingClicked = require('./assets/setting_clicked.png');
const settingUnclicked = require('./assets/setting_unclicked.png');

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarLabel: t('tabHome'),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused ? habitClicked : habitUnclicked} 
              style={{ width: 24, height: 24 }} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: t('tabProfile'),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused ? individualClicked : individualUnclicked} 
              style={{ width: 24, height: 24 }} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen}
        options={{ 
          tabBarLabel: t('tabStatistics'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, color: focused ? '#4CAF50' : 'gray' }}>
              📊
            </Text>
          )
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          tabBarLabel: t('tabSettings'),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused ? settingClicked : settingUnclicked} 
              style={{ width: 24, height: 24 }} 
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  const { t } = useLanguage();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateHabit" 
        component={CreateHabitScreen}
        options={{ title: t('createHabit') }}
      />
      <Stack.Screen 
        name="HabitDetail" 
        component={HabitDetailScreen}
        options={{ title: t('habitDetail') }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

