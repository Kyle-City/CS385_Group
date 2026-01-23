import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 翻译资源
const translations = {
  zh: {
    // 导航栏
    tabHome: '习惯',
    tabProfile: '我的',
    tabStatistics: '统计',
    tabSettings: '设置',
    
    // 登录注册
    loginTitle: '习惯追踪',
    loginSubtitle: '登录您的账户',
    email: '邮箱',
    password: '密码',
    login: '登录',
    loggingIn: '登录中...',
    noAccount: '还没有账户？点击注册',
    registerTitle: '创建账户',
    registerSubtitle: '开始您的习惯追踪之旅',
    username: '用户名',
    confirmPassword: '确认密码',
    passwordHint: '密码（至少6个字符）',
    register: '注册',
    registering: '注册中...',
    hasAccount: '已有账户？点击登录',
    
    // 错误信息
    error: '错误',
    loginFailed: '登录失败',
    registerFailed: '注册失败',
    pleaseEnterEmailPassword: '请输入邮箱和密码',
    checkEmailPassword: '请检查您的邮箱和密码',
    fillAllFields: '请填写所有字段',
    passwordMinLength: '密码长度至少为6个字符',
    passwordMismatch: '两次输入的密码不一致',
    registrationError: '注册时发生错误',
    
    // 主页
    noHabits: '还没有习惯',
    createFirstHabit: '点击右下角 + 创建你的第一个习惯',
    checkIn: '打卡',
    loading: '加载中...',
    loadingFailed: '加载习惯列表失败',
    checkInSuccess: '打卡成功！',
    checkInFailed: '打卡失败',
    checkInTooFrequent: '打卡太频繁，请等待打卡周期后再试',
    waitDaysBeforeCheckIn: '还需等待 {days} 天后才能打卡',
    streak: '连续',
    days: '天',
    total: '总计',
    times: '次',
    
    // 创建习惯
    createHabit: '创建习惯',
    habitName: '习惯名称',
    description: '描述',
    selectColor: '选择颜色',
    selectIcon: '选择图标',
    preview: '预览',
    createHabitExample: '例如：每天运动30分钟',
    addDescription: '添加一些描述...',
    creating: '创建中...',
    habitCreated: '习惯创建成功！',
    createHabitFailed: '创建习惯失败',
    enterHabitName: '请输入习惯名称',
    checkinInterval: '打卡周期',
    checkinIntervalDesc: '每',
    checkinIntervalDays: '天',
    checkinIntervalMinError: '打卡周期至少为1天',
    checkinIntervalInvalid: '请输入有效的天数（整数）',
    
    // 习惯详情
    habitDetail: '习惯详情',
    habitNotExist: '习惯不存在',
    loadingDetailFailed: '加载习惯详情失败',
    continuousDays: '连续天数',
    totalCompletions: '总完成次数',
    completionRate: '完成率',
    startDate: '开始日期',
    checkInHistory: '打卡记录',
    noCheckInRecord: '还没有打卡记录',
    checkingIn: '打卡中...',
    checkInToday: '今日打卡',
    deleteHabit: '删除习惯',
    confirmDeleteHabit: '确定要删除这个习惯吗？此操作不可撤销。',
    cancel: '取消',
    delete: '删除',
    habitDeleted: '习惯已删除',
    deleteHabitFailed: '删除习惯失败',
    moreRecords: '还有 {count} 条记录...',
    
    // 个人资料
    user: '用户',
    statistics: '统计数据',
    totalHabits: '总习惯数',
    totalCheckIns: '总打卡数',
    longestStreak: '最长连续',
    logout: '退出登录',
    confirmLogout: '确定要退出登录吗？',
    
    // 设置
    generalSettings: '通用设置',
    themeColor: '主题颜色',
    defaultTheme: '默认',
    language: '语言',
    simplifiedChinese: '简体中文',
    english: 'English',
    dataManagement: '数据管理',
    clearCache: '清除本地缓存',
    confirmClearCache: '确定要清除本地缓存吗？这将清除所有本地数据，但不会影响服务器数据。',
    clear: '清除',
    cacheCleared: '缓存已清除',
    clearCacheFailed: '清除缓存失败',
    about: '关于',
    version: '版本',
    success: '成功',
    confirm: '确定',
    
    // 统计页面
    weeklyStatistics: '一周打卡统计',
    weeklyStatisticsDesc: '显示最近一周各习惯的打卡完成率',
    completionStatistics: '习惯完成率统计',
    completionStatisticsDesc: '显示各习惯从创建至今的总体完成率',
    weeklyCheckinRate: '打卡完成率',
    habitCompletionRate: '习惯完成率',
    noStatisticsData: '暂无统计数据，快去创建习惯并打卡吧！',
    legend: '图例说明',
    legendActualTheoretical: '实际打卡次数/理论上最高打卡次数',
    legendPercentage: '完成率 = 实际次数 ÷ 理论最高次数 × 100%',
    
    // 打卡周期
    checkinIntervalLabel: '打卡周期',
    checkinIntervalEvery: '每',
    checkinIntervalDay: '天',
    checkinIntervalDays: '天',
    cannotCheckInYet: '还需等待',
    daysToCheckIn: '天后才能打卡',
    checkinIntervalWarning: '该习惯的打卡周期为',
    days: '天',
  },
  en: {
    // Navigation
    tabHome: 'Habits',
    tabProfile: 'Profile',
    tabStatistics: 'Statistics',
    tabSettings: 'Settings',
    
    // Login & Register
    loginTitle: 'Habit Tracker',
    loginSubtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    noAccount: 'No account yet? Sign up',
    registerTitle: 'Create Account',
    registerSubtitle: 'Start your habit tracking journey',
    username: 'Username',
    confirmPassword: 'Confirm Password',
    passwordHint: 'Password (at least 6 characters)',
    register: 'Register',
    registering: 'Registering...',
    hasAccount: 'Already have an account? Sign in',
    
    // Error messages
    error: 'Error',
    loginFailed: 'Login Failed',
    registerFailed: 'Registration Failed',
    pleaseEnterEmailPassword: 'Please enter email and password',
    checkEmailPassword: 'Please check your email and password',
    fillAllFields: 'Please fill all fields',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    registrationError: 'An error occurred during registration',
    
    // Home
    noHabits: 'No habits yet',
    createFirstHabit: 'Tap the + button to create your first habit',
    checkIn: 'Check In',
    loading: 'Loading...',
    loadingFailed: 'Failed to load habits',
    checkInSuccess: 'Check in successful!',
    checkInFailed: 'Check in failed',
    checkInTooFrequent: 'Check-in too frequent. Please wait for the check-in interval.',
    waitDaysBeforeCheckIn: 'Please wait {days} more day(s) before checking in again',
    streak: 'Streak',
    days: 'days',
    total: 'Total',
    times: 'times',
    
    // Create Habit
    createHabit: 'Create Habit',
    habitName: 'Habit Name',
    description: 'Description',
    selectColor: 'Select Color',
    selectIcon: 'Select Icon',
    preview: 'Preview',
    createHabitExample: 'e.g., Exercise for 30 minutes daily',
    addDescription: 'Add a description...',
    creating: 'Creating...',
    habitCreated: 'Habit created successfully!',
    createHabitFailed: 'Failed to create habit',
    enterHabitName: 'Please enter habit name',
    checkinInterval: 'Check-in Interval',
    checkinIntervalDesc: 'Every',
    checkinIntervalDays: 'days',
    checkinIntervalMinError: 'Check-in interval must be at least 1 day',
    checkinIntervalInvalid: 'Please enter a valid number of days (integer)',
    
    // Habit Detail
    habitDetail: 'Habit Detail',
    habitNotExist: 'Habit does not exist',
    loadingDetailFailed: 'Failed to load habit details',
    continuousDays: 'Continuous Days',
    totalCompletions: 'Total Completions',
    completionRate: 'Completion Rate',
    startDate: 'Start Date',
    checkInHistory: 'Check-in History',
    noCheckInRecord: 'No check-in records yet',
    checkingIn: 'Checking in...',
    checkInToday: 'Check In Today',
    deleteHabit: 'Delete Habit',
    confirmDeleteHabit: 'Are you sure you want to delete this habit? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    habitDeleted: 'Habit deleted',
    deleteHabitFailed: 'Failed to delete habit',
    moreRecords: '{count} more records...',
    
    // Profile
    user: 'User',
    statistics: 'Statistics',
    totalHabits: 'Total Habits',
    totalCheckIns: 'Total Check-ins',
    longestStreak: 'Longest Streak',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    
    // Settings
    generalSettings: 'General Settings',
    themeColor: 'Theme Color',
    defaultTheme: 'Default',
    language: 'Language',
    simplifiedChinese: '简体中文',
    english: 'English',
    dataManagement: 'Data Management',
    clearCache: 'Clear Local Cache',
    confirmClearCache: 'Are you sure you want to clear local cache? This will clear all local data but will not affect server data.',
    clear: 'Clear',
    cacheCleared: 'Cache cleared',
    clearCacheFailed: 'Failed to clear cache',
    about: 'About',
    version: 'Version',
    success: 'Success',
    confirm: 'OK',
    
    // Statistics
    weeklyStatistics: 'Weekly Check-in Statistics',
    weeklyStatisticsDesc: 'Show check-in completion rate for each habit in the past week',
    completionStatistics: 'Habit Completion Statistics',
    completionStatisticsDesc: 'Show overall completion rate for each habit since creation',
    weeklyCheckinRate: 'Check-in Completion Rate',
    habitCompletionRate: 'Habit Completion Rate',
    noStatisticsData: 'No statistics data yet. Create habits and start checking in!',
    legend: 'Legend',
    legendActualTheoretical: 'Actual check-ins / Theoretical maximum check-ins',
    legendPercentage: 'Completion rate = Actual ÷ Theoretical max × 100%',
    
    // Check-in Interval
    checkinIntervalLabel: 'Check-in Interval',
    checkinIntervalEvery: 'Every',
    checkinIntervalDay: 'day',
    checkinIntervalDays: 'days',
    cannotCheckInYet: 'Please wait',
    daysToCheckIn: 'more day(s) before checking in again',
    checkinIntervalWarning: 'The check-in interval for this habit is',
    days: 'days',
  },
};

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      if (newLanguage === 'zh' || newLanguage === 'en') {
        setLanguage(newLanguage);
        await AsyncStorage.setItem('language', newLanguage);
      }
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || key;
    
    // 替换参数，如 {count}
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);


