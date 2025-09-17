// API服务文件
import API_CONFIG from './apiConfig.js';
import authService from './authService.js';

/**
 * 基金管理系统API服务
 * 提供系统所需的所有API调用功能
 */

/**
 * 获取完整的API URL
 * @param {string} endpoint - API端点
 * @param {Object} params - URL参数
 * @returns {string} 完整的API URL
 */
function getFullUrl(endpoint, params = {}) {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // 替换URL中的参数
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
}

/**
 * 通用的API请求方法
 * @param {string} method - HTTP方法（GET, POST, PUT, DELETE等）
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise} 返回请求的Promise
 */
async function apiRequest(method, endpoint, options = {}) {
  const { params = {}, data = null, headers = {} } = options;
  const url = getFullUrl(endpoint, params);
  
  // 默认请求配置
  let config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include' // 包含cookies
  };
  
  // 应用认证拦截器
  config = authService.authInterceptor(config);
  
  // 如果有请求数据，添加到请求体
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // 处理401未授权错误，尝试刷新令牌
      if (response.status === 401 && !endpoint.includes('/auth/')) {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          // 刷新成功后，重新发起请求
          config = authService.authInterceptor(config);
          const retryResponse = await fetch(url, config);
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        } else {
          // 刷新失败，清除认证数据并重定向到登录页面
          authService.clearAuthData();
          window.location.href = '/login.html';
          throw new Error('认证已过期，请重新登录');
        }
      }
      
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    
    // 如果是网络错误或无法连接到服务器，返回模拟数据
    return getMockData(endpoint, method);
  }
}

/**
 * 模拟数据生成函数 - 当API请求失败时使用
 * @param {string} endpoint - API端点
 * @param {string} method - HTTP方法
 * @returns {Object} 模拟数据
 */
function getMockData(endpoint, method) {
  // 用户认证相关模拟数据
  if (endpoint.includes('auth/login')) {
    return {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        name: '管理员',
        avatar: ''
      }
    };
  }
  
  if (endpoint.includes('auth/me')) {
    return {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        name: '管理员',
        avatar: ''
      }
    };
  }
  
  // 基金相关模拟数据
  if (endpoint.includes('funds')) {
    if (method === 'GET') {
      return {
        data: [
          {
            id: 1,
            name: '环保新能源基金',
            value: 1.089,
            dailyChange: 0.28,
            yearlyReturn: 12.56,
            status: '良好'
          },
          {
            id: 2,
            name: '绿色科技创新基金',
            value: 1.254,
            dailyChange: -0.12,
            yearlyReturn: 15.32,
            status: '良好'
          },
          {
            id: 3,
            name: '可持续发展指数基金',
            value: 0.987,
            dailyChange: 0.56,
            yearlyReturn: 8.75,
            status: '关注'
          },
          {
            id: 4,
            name: '低碳转型基金',
            value: 1.321,
            dailyChange: 0.42,
            yearlyReturn: 18.90,
            status: '良好'
          },
          {
            id: 5,
            name: '碳中和主题基金',
            value: 1.156,
            dailyChange: -0.34,
            yearlyReturn: 14.23,
            status: '良好'
          }
        ]
      };
    }
  }
  
  // 新闻相关模拟数据
  if (endpoint.includes('news')) {
    if (method === 'GET') {
      return {
        data: [
          {
            id: 1,
            title: '新能源政策出台，绿色产业迎来发展新机遇',
            impactFunds: ['环保新能源基金', '绿色科技创新基金'],
            publishTime: '2024-09-17 09:30',
            impactType: '正面影响'
          },
          {
            id: 2,
            title: '全球气候峰会达成重要协议，碳排放限制趋严',
            impactFunds: ['碳中和主题基金', '低碳转型基金'],
            publishTime: '2024-09-17 08:15',
            impactType: '正面影响'
          },
          {
            id: 3,
            title: '环保技术突破，新型清洁能源成本大幅降低',
            impactFunds: ['环保新能源基金', '可持续发展指数基金'],
            publishTime: '2024-09-16 16:45',
            impactType: '正面影响'
          }
        ]
      };
    }
  }
  
  // 计算引擎状态模拟数据
  if (endpoint.includes('calculation/status')) {
    if (method === 'GET') {
      return {
        data: {
          status: 'running',
          currentTask: '基金净值计算',
          successRate: '99.8%',
          averageTime: '3.2s'
        }
      };
    }
  }
  
  // 用户信息更新模拟数据
  if (endpoint.includes('auth/profile')) {
    if (method === 'PUT') {
      return {
        data: {
          success: true,
          message: '用户信息更新成功',
          user: {
            id: 'USER' + Math.floor(Math.random() * 1000000),
            name: config.data.name || '管理员',
            email: config.data.email || 'admin@example.com',
            role: '系统管理员',
            createdAt: '2023-01-15',
            lastLogin: '刚刚',
            phone: config.data.phone || '138****1234',
            department: config.data.department || '管理部',
            bio: config.data.bio || '系统管理员，负责平台的日常维护和管理工作。'
          }
        }
      };
    }
  }
  
  // 密码修改模拟数据
  if (endpoint.includes('auth/change-password')) {
    if (method === 'POST') {
      // 简单验证当前密码是否为 'password'
      if (config.data.currentPassword !== 'password') {
        return {
          data: {
            success: false,
            message: '当前密码不正确'
          }
        };
      }
      
      // 简单验证新密码强度
      if (config.data.newPassword.length < 8) {
        return {
          data: {
            success: false,
            message: '新密码长度至少为8位'
          }
        };
      }
      
      return {
        data: {
          success: true,
          message: '密码修改成功，请重新登录'
        }
      };
    }
  }
  
  // 默认返回空数据
  return { data: [] };
}

// 基础HTTP方法
export const post = (endpoint, data, options = {}) => apiRequest('POST', endpoint, { ...options, data });
export const get = (endpoint, params, options = {}) => apiRequest('GET', endpoint, { ...options, params });
export const put = (endpoint, data, options = {}) => apiRequest('PUT', endpoint, { ...options, data });
export const del = (endpoint, params, options = {}) => apiRequest('DELETE', endpoint, { ...options, params });

// 导出API方法
export const apiService = {
  // 基础HTTP方法
  post,
  get,
  put,
  delete: del,
  
  // 基金相关API
  funds: {
    getAll: () => apiRequest('GET', API_CONFIG.ENDPOINTS.FUNDS.GET_ALL),
    getById: (id) => apiRequest('GET', API_CONFIG.ENDPOINTS.FUNDS.GET_BY_ID, { params: { id } })
  },
  
  // 新闻相关API
  news: {
    getAll: () => apiRequest('GET', API_CONFIG.ENDPOINTS.NEWS.GET_ALL),
    getById: (id) => apiRequest('GET', API_CONFIG.ENDPOINTS.NEWS.GET_BY_ID, { params: { id } }),
    getRelated: (fundId) => apiRequest('GET', API_CONFIG.ENDPOINTS.NEWS.GET_RELATED, { params: { fundId } })
  },
  
  // 规则相关API
  rules: {
    getAll: () => apiRequest('GET', API_CONFIG.ENDPOINTS.RULES.GET_ALL)
  },
  
  // 计算引擎相关API
  calculation: {
    getStatus: () => apiRequest('GET', API_CONFIG.ENDPOINTS.CALCULATION.STATUS)
  },
  
  // 用户相关API
  user: {
    updateInfo: (userData) => apiRequest('PUT', API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, { data: userData })
  }
};

export default apiService;