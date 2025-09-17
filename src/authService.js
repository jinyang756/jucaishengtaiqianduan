// 认证服务文件
import API_CONFIG from './apiConfig.js';
import apiService from './apiService.js';

// 用户会话键名
const SESSION_KEYS = {
  TOKEN: 'eco_fund_auth_token',
  USER: 'eco_fund_user_data',
  REFRESH_TOKEN: 'eco_fund_refresh_token'
};

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证（用户名/邮箱、密码）
 * @returns {Promise<Object>} 返回登录结果
 */
export async function login(credentials) {
  try {
    const response = await apiService.post(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.token && response.user) {
      // 存储用户会话信息
      setAuthToken(response.token);
      setUser(response.user);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 用户注册
 * @param {Object} userData - 用户注册信息
 * @returns {Promise<Object>} 返回注册结果
 */
export async function register(userData) {
  try {
    const response = await apiService.post(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
    
    return response;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
}

/**
 * 用户注销
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.warn('注销请求失败，继续清除本地会话:', error);
  } finally {
    // 清除本地会话信息
    clearAuthData();
    // 重定向到登录页面
    window.location.href = '/login.html';
  }
}

/**
 * 获取当前登录用户信息
 * @returns {Promise<Object>} 用户信息
 */
export async function getCurrentUser() {
  // 先尝试从本地获取
  const localUser = getUser();
  if (localUser) {
    return localUser;
  }

  // 如果本地没有，尝试从API获取
  try {
    const response = await apiService.get(API_CONFIG.ENDPOINTS.AUTH.ME);
    if (response.user) {
      setUser(response.user);
      return response.user;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }

  return null;
}

/**
 * 修改用户密码
 * @param {string} currentPassword - 当前密码
 * @param {string} newPassword - 新密码
 * @returns {Promise<Object>} 返回修改结果
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await apiService.post(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    
    return response;
  } catch (error) {
    console.error('修改密码失败:', error);
    throw error;
  }
}

/**
 * 刷新认证令牌
 * @returns {Promise<boolean>} 是否刷新成功
 */
export async function refreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await apiService.post(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    if (response.token) {
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      return true;
    }
  } catch (error) {
    console.error('刷新令牌失败:', error);
  }

  return false;
}

/**
 * 设置认证令牌
 * @param {string} token - JWT令牌
 */
export function setAuthToken(token) {
  localStorage.setItem(SESSION_KEYS.TOKEN, token);
}

/**
 * 获取认证令牌
 * @returns {string|null} 令牌
 */
export function getAuthToken() {
  return localStorage.getItem(SESSION_KEYS.TOKEN);
}

/**
 * 设置刷新令牌
 * @param {string} refreshToken - 刷新令牌
 */
export function setRefreshToken(refreshToken) {
  localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
}

/**
 * 获取刷新令牌
 * @returns {string|null} 刷新令牌
 */
export function getRefreshToken() {
  return localStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);
}

/**
 * 设置用户信息
 * @param {Object} user - 用户信息
 */
export function setUser(user) {
  localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export function getUser() {
  const userData = localStorage.getItem(SESSION_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
}

/**
 * 清除所有认证数据
 */
export function clearAuthData() {
  localStorage.removeItem(SESSION_KEYS.TOKEN);
  localStorage.removeItem(SESSION_KEYS.USER);
  localStorage.removeItem(SESSION_KEYS.REFRESH_TOKEN);
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isAuthenticated() {
  const token = getAuthToken();
  return !!token;
}

/**
 * 验证令牌是否有效（简单验证，实际应验证签名）
 * @returns {boolean} 令牌是否有效
 */
export function isTokenValid() {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // 简单解码检查令牌是否过期
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const exp = decodedPayload.exp;
    
    return exp && Date.now() < exp * 1000;
  } catch (error) {
    console.error('令牌验证失败:', error);
    return false;
  }
}

/**
 * 认证拦截器 - 用于在API请求中添加认证头
 * @param {Object} config - 请求配置
 * @returns {Object} 更新后的配置
 */
export function authInterceptor(config) {
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  changePassword,
  refreshToken,
  setAuthToken,
  getAuthToken,
  setUser,
  getUser,
  clearAuthData,
  isAuthenticated,
  isTokenValid,
  authInterceptor
};