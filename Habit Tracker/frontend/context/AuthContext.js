import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://10.132.100.124:3000';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Verify token by fetching user info
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // 如果是网络错误，不清除 token，只清除用户信息
      // 这样用户可以在网络恢复后继续使用
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.warn('Network error during auth check - server may be offline');
        // 不清除 token，等待网络恢复
      } else {
        // 其他错误（如 token 无效），清除 token
        await AsyncStorage.removeItem('token');
        setToken(null);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = '登录失败';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = '无法连接到服务器，请检查后端是否运行';
      } else if (error.response) {
        // 服务器返回了错误响应
        errorMessage = error.response.data?.message || `服务器错误: ${error.response.status}`;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        errorMessage = '服务器无响应，请检查网络连接';
      } else {
        errorMessage = error.message || '登录失败';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        username,
      });

      const { token: newToken, user: userData } = response.data;
      
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      let errorMessage = '注册失败';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = '无法连接到服务器，请检查后端是否运行';
      } else if (error.response) {
        // 服务器返回了错误响应
        errorMessage = error.response.data?.message || `服务器错误: ${error.response.status}`;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        errorMessage = '服务器无响应，请检查网络连接';
      } else {
        errorMessage = error.message || '注册失败';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



