// API配置文件
const API_CONFIG = {
  // 后端API基础地址
  BASE_URL: import.meta.env.VITE_API_URL || 'https://jucaishengtaihouduan.vercel.app/api',
  
  // API端点
  ENDPOINTS: {
    // 认证相关API
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH: '/auth/refresh',
      UPDATE_PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password'
    },
    
    // 基金相关API
    FUNDS: {
      GET_ALL: '/funds',
      GET_BY_ID: '/funds/:id',
      UPDATE: '/funds/:id'
    },
    
    // 新闻相关API
    NEWS: {
      GET_ALL: '/news',
      GET_BY_ID: '/news/:id',
      GET_RELATED: '/news/related/:fundId'
    },
    
    // 规则相关API
    RULES: {
      GET_ALL: '/rules',
      CREATE: '/rules',
      UPDATE: '/rules/:id',
      DELETE: '/rules/:id'
    },
    
    // 计算引擎相关API
    CALCULATION: {
      STATUS: '/calculation/status',
      RUN: '/calculation/run'
    },
    
    // 交易相关API
    TRANSACTIONS: {
      GET_ALL: '/transactions',
      CREATE: '/transactions',
      GET_BY_ID: '/transactions/:id'
    },
    
    // 持仓相关API
    PORTFOLIO: {
      GET_ALL: '/portfolio',
      GET_BY_ID: '/portfolio/:id'
    }
  }
};

export default API_CONFIG;