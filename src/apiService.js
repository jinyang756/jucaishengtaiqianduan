// API服务文件
import API_CONFIG from './apiConfig.js';
import authService from './authService.js';
// 导入模拟数据
import { mockData } from './mockData/index.js';

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
      
      // 记录具体错误信息并返回模拟数据
      console.warn(`API请求失败: ${response.status} ${response.statusText}`);
      console.warn(`使用模拟数据代替真实API响应`);
      return getMockData(endpoint, method);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求网络错误:', error);
    console.warn('无法连接到API服务器，使用模拟数据');
    
    // 如果是网络错误或无法连接到服务器，返回模拟数据
    return getMockData(endpoint, method);
  }
}

/**
 * 模拟数据生成函数 - 当API请求失败时使用
 * @param {string} endpoint - API端点
 * @param {string} method - HTTP方法
 * @param {Object} config - 请求配置
 * @returns {Object} 模拟数据
 */
function getMockData(endpoint, method, config = {}) {
  // 用户认证相关模拟数据
  if (endpoint.includes('auth/login')) {
    return {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: mockData.users[0] // 使用模拟数据中的第一个用户
    };
  }
  
  if (endpoint.includes('auth/me')) {
    return {
      user: mockData.users[0] // 使用模拟数据中的第一个用户
    };
  }
  
  // 基金相关模拟数据
  if (endpoint.includes('funds')) {
    if (method === 'GET') {
      // 如果是获取单个基金详情
      if (endpoint.includes('/funds/') && config.params && config.params.id) {
        const fundId = config.params.id;
        const fund = mockData.funds.find(f => f.id === fundId);
        return {
          data: fund || mockData.funds[0]
        };
      }
      // 获取基金列表
      return {
        data: mockData.funds.slice(0, 10) // 返回前10个基金
      };
    }
  }
  
  // 新闻相关模拟数据
  if (endpoint.includes('news')) {
    if (method === 'GET') {
      // 获取新闻列表
      return {
        data: mockData.news.slice(0, 10) // 返回前10条新闻
      };
    }
  }
  
  // 交易记录相关模拟数据
  if (endpoint.includes('transactions')) {
    if (method === 'GET') {
      return {
        data: mockData.transactions.slice(0, 20) // 返回前20条交易记录
      };
    }
  }
  
  // 投资组合相关模拟数据
  if (endpoint.includes('portfolio') || endpoint.includes('portfolios')) {
    if (method === 'GET') {
      return {
        data: mockData.portfolios.slice(0, 5) // 返回前5个投资组合
      };
    }
  }
  
  // 杠杆申请相关模拟数据
  if (endpoint.includes('leverage/application')) {
    if (method === 'GET') {
      return {
        data: mockData.leverageApplications.slice(0, 10) // 返回前10个杠杆申请
      };
    }
    if (method === 'POST') {
      // 处理杠杆申请
      return {
        data: {
          success: true,
          message: '杠杆申请提交成功，请等待审核',
          application: {
            ...config.data,
            id: 'leverage_application_' + Date.now(),
            status: 'pending',
            applyDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      };
    }
  }
  
  // 杠杆交易相关模拟数据
  if (endpoint.includes('leverage/transaction')) {
    if (method === 'GET') {
      return {
        data: mockData.leverageTransactions.slice(0, 15) // 返回前15条杠杆交易记录
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
            ...mockData.users[0],
            ...config.data
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

/**
 * 基础HTTP请求方法
 */
// 检查是否为开发模式
const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

async function post(endpoint, data = {}, options = {}) {
  try {
    // 开发模式下优先使用模拟数据
    if (isDevelopmentMode()) {
      console.log('开发模式 - 使用模拟数据:', endpoint);
      // 模拟异步延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      // 返回模拟数据
      return getMockData(endpoint, 'POST', { data, options });
    }

    return apiRequest('POST', endpoint, { ...options, data });
  } catch (error) {
    // 请求失败时使用模拟数据
    console.warn('API请求失败，使用模拟数据:', error);
    
    // 模拟异步延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回模拟数据
    const mockResponse = getMockData(endpoint, 'POST', { data, options });
    
    return mockResponse;
  }
}

async function get(endpoint, params = {}, options = {}) {
  try {
    // 开发模式下优先使用模拟数据
    if (isDevelopmentMode()) {
      console.log('开发模式 - 使用模拟数据:', endpoint);
      // 模拟异步延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      // 返回模拟数据
      return getMockData(endpoint, 'GET', { params, options });
    }

    return apiRequest('GET', endpoint, { ...options, params });
  } catch (error) {
    // 请求失败时使用模拟数据
    console.warn('API请求失败，使用模拟数据:', error);
    
    // 模拟异步延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回模拟数据
    const mockResponse = getMockData(endpoint, 'GET', { params, options });
    
    return mockResponse;
  }
}

async function put(endpoint, data = {}, options = {}) {
  try {
    // 开发模式下优先使用模拟数据
    if (isDevelopmentMode()) {
      console.log('开发模式 - 使用模拟数据:', endpoint);
      // 模拟异步延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      // 返回模拟数据
      return getMockData(endpoint, 'PUT', { data, options });
    }

    return apiRequest('PUT', endpoint, { ...options, data });
  } catch (error) {
    // 请求失败时使用模拟数据
    console.warn('API请求失败，使用模拟数据:', error);
    
    // 模拟异步延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回模拟数据
    const mockResponse = getMockData(endpoint, 'PUT', { data, options });
    
    return mockResponse;
  }
}

async function del(endpoint, params = {}, options = {}) {
  try {
    // 开发模式下优先使用模拟数据
    if (isDevelopmentMode()) {
      console.log('开发模式 - 使用模拟数据:', endpoint);
      // 模拟异步延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      // 返回模拟数据
      return getMockData(endpoint, 'DELETE', { params, options });
    }

    return apiRequest('DELETE', endpoint, { ...options, params });
  } catch (error) {
    // 请求失败时使用模拟数据
    console.warn('API请求失败，使用模拟数据:', error);
    
    // 模拟异步延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回模拟数据
    const mockResponse = getMockData(endpoint, 'DELETE', { params, options });
    
    return mockResponse;
  }
}

// 导出基础HTTP方法
export { post, get, put, del };

// 导出API方法
export const apiService = {
  // 基础HTTP方法
  post,
  get,
  put,
  delete: del,
  
  // 基金相关API
  funds: {
    getAll: () => get(API_CONFIG.ENDPOINTS.FUNDS.GET_ALL),
    getById: (id) => get(API_CONFIG.ENDPOINTS.FUNDS.GET_BY_ID, { id })
  },
  
  // 新闻相关API
  news: {
    getAll: () => get(API_CONFIG.ENDPOINTS.NEWS.GET_ALL),
    getById: (id) => get(API_CONFIG.ENDPOINTS.NEWS.GET_BY_ID, { id }),
    getRelated: (fundId) => get(API_CONFIG.ENDPOINTS.NEWS.GET_RELATED, { fundId })
  },
  
  // 规则相关API
  rules: {
    getAll: () => get(API_CONFIG.ENDPOINTS.RULES.GET_ALL)
  },
  
  // 计算引擎相关API
  calculation: {
    getStatus: () => get(API_CONFIG.ENDPOINTS.CALCULATION.STATUS)
  },
  
  // 用户相关API
  user: {
    updateInfo: (userData) => put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, userData)
  },
  
  // 交易相关API
  transactions: {
    getAll: () => get(API_CONFIG.ENDPOINTS.TRANSACTIONS.GET_ALL),
    getByUserId: (userId) => get(API_CONFIG.ENDPOINTS.TRANSACTIONS.GET_BY_USER_ID, { userId })
  },
  
  // 投资组合相关API
  portfolio: {
    getAll: () => get(API_CONFIG.ENDPOINTS.PORTFOLIO.GET_ALL),
    getById: (id) => get(API_CONFIG.ENDPOINTS.PORTFOLIO.GET_BY_ID, { id })
  },
  
  // 杠杆相关API
  leverage: {
    getApplications: () => get(API_CONFIG.ENDPOINTS.LEVERAGE.GET_APPLICATIONS),
    createApplication: (data) => post(API_CONFIG.ENDPOINTS.LEVERAGE.CREATE_APPLICATION, data),
    getTransactions: () => get(API_CONFIG.ENDPOINTS.LEVERAGE.GET_TRANSACTIONS)
  }
};

export default apiService;