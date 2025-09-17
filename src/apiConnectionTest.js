// 前端与后端连接测试脚本
// 用于验证已配置的前后端通信是否正常，并在API不可用时提供模拟数据支持

import API_CONFIG from './apiConfig.js';
import apiService from './apiService.js';
import { mockFunds } from './mockData/funds.js';
import { mockNews } from './mockData/news.js';
import { mockUsers } from './mockData/users.js';

// 连接状态管理
export let apiConnectionStatus = {
  isConnected: false,
  lastChecked: null,
  error: null,
  useMockData: false
};

/**
 * 测试单个API端点
 * @param {string} endpoint - API端点路径
 * @param {string} method - HTTP方法
 * @param {string} moduleName - 模块名称
 * @param {object} options - 请求选项
 * @returns {Promise<{success: boolean, message: string, responseTime?: number}>}
 */
async function testSingleEndpoint(endpoint, method = 'GET', moduleName = '未知模块', options = {}) {
  const startTime = performance.now();
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(fullUrl, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    if (response.ok) {
      return {
        success: true,
        message: `✓ ${moduleName} API (${method}) 连接成功，响应时间: ${responseTime}ms，状态码: ${response.status}`,
        responseTime
      };
    } else {
      return {
        success: false,
        message: `✗ ${moduleName} API (${method}) 连接失败，状态码: ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    return {
      success: false,
      message: `✗ ${moduleName} API (${method}) 连接异常: ${error.message || '未知错误'}`,
      responseTime
    };
  }
}

/**
 * 测试多个API端点
 * @param {Array<{endpoint: string, method: string, moduleName: string, options: object}>} endpoints - 要测试的端点列表
 * @returns {Promise<Array<{success: boolean, message: string, moduleName: string}>>}
 */
async function testMultipleEndpoints(endpoints) {
  const results = [];
  
  console.log('\n开始测试多个API端点...');
  
  // 串行测试以避免请求过多
  for (const { endpoint, method, moduleName, options } of endpoints) {
    const result = await testSingleEndpoint(endpoint, method, moduleName, options);
    console.log(result.message);
    results.push({ ...result, moduleName });
  }
  
  return results;
}

/**
 * 切换到模拟数据模式
 * @param {boolean} useMock - 是否使用模拟数据
 */
export function toggleMockDataMode(useMock) {
  apiConnectionStatus.useMockData = useMock;
  
  if (useMock) {
    console.log('\n🔄 已切换到模拟数据模式！所有API请求将使用本地模拟数据。');
    // 这里可以添加更多的模拟数据初始化逻辑
  } else {
    console.log('\n🔄 已切换到真实API模式！所有API请求将发送到后端服务器。');
  }
}

/**
 * 自动检测并切换到合适的数据模式（真实API或模拟数据）
 * @returns {Promise<boolean>} - 返回是否使用模拟数据
 */
export async function autoDetectDataMode() {
  console.log('\n开始自动检测数据模式...');
  
  try {
    // 快速测试API连接
    const testEndpoint = API_CONFIG.ENDPOINTS.AUTH.LOGIN;
    const result = await fetch(`${API_CONFIG.BASE_URL}${testEndpoint}`, {
      method: 'OPTIONS',
      timeout: 3000
    });
    
    if (result.ok) {
      console.log('✓ API连接正常，使用真实API数据。');
      apiConnectionStatus.isConnected = true;
      toggleMockDataMode(false);
      return false;
    } else {
      console.log('✗ API连接异常，自动切换到模拟数据模式。');
      apiConnectionStatus.isConnected = false;
      apiConnectionStatus.error = `API返回状态码: ${result.status}`;
      toggleMockDataMode(true);
      return true;
    }
  } catch (error) {
    console.log('✗ API连接失败，自动切换到模拟数据模式。');
    console.log('错误详情:', error.message);
    apiConnectionStatus.isConnected = false;
    apiConnectionStatus.error = error.message;
    toggleMockDataMode(true);
    return true;
  } finally {
    apiConnectionStatus.lastChecked = new Date().toISOString();
  }
}

/**
 * 获取模拟数据
 * @param {string} dataType - 数据类型（funds, news, users等）
 * @param {object} options - 筛选选项
 * @returns {Array|Object|null} - 返回对应的数据
 */
export function getMockData(dataType, options = {}) {
  const mockDataMap = {
    funds: mockFunds,
    news: mockNews,
    users: mockUsers
  };
  
  const data = mockDataMap[dataType];
  if (!data) {
    console.warn(`未找到${dataType}的模拟数据`);
    return null;
  }
  
  // 应用基本筛选（如果有）
  if (options.filter && typeof options.filter === 'function') {
    return data.filter(options.filter);
  }
  
  // 应用分页（如果有）
  if (options.page && options.pageSize) {
    const startIndex = (options.page - 1) * options.pageSize;
    const endIndex = startIndex + options.pageSize;
    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(data.length / options.pageSize)
    };
  }
  
  return data;
}

/**
 * 测试前后端API连接
 * @param {boolean} autoSwitchMode - 是否自动切换数据模式
 * @param {boolean} detailedTest - 是否进行详细测试
 * @returns {Promise<{success: boolean, details: object}>}
 */
async function testApiConnection(autoSwitchMode = true, detailedTest = false) {
  console.log('\n===========================================');
  console.log('🚀 开始测试前后端API连接...');
  console.log('===========================================');
  console.log('当前使用的API基础URL:', API_CONFIG.BASE_URL);
  console.log('前端域名:', window.location.origin);
  console.log('测试时间:', new Date().toLocaleString());
  
  try {
    // 测试1: 检查网络连接
    console.log('\n测试1: 检查基本网络连接');
    const networkTest = await navigator.onLine ? 
      { success: true, message: '✓ 网络连接正常' } : 
      { success: false, message: '✗ 网络连接异常' };
    console.log(networkTest.message);
    
    // 测试2: 检查API服务器可访问性
    console.log('\n测试2: 检查API服务器可访问性');
    const apiResponse = await fetch(API_CONFIG.BASE_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    let apiServerStatus = {};
    if (apiResponse.ok) {
      apiServerStatus = { success: true, message: `✓ API服务器可访问，状态码: ${apiResponse.status}` };
      apiConnectionStatus.isConnected = true;
    } else {
      apiServerStatus = { success: false, message: `✗ API服务器返回非成功状态码: ${apiResponse.status}` };
      apiConnectionStatus.isConnected = false;
      apiConnectionStatus.error = `服务器返回状态码: ${apiResponse.status}`;
    }
    console.log(apiServerStatus.message);
    
    // 测试3: 检查环境变量配置
    console.log('\n测试3: 检查环境变量配置');
    console.log('VITE_API_URL环境变量:', import.meta.env.VITE_API_URL || '未设置');
    
    // 检查CORS配置
    console.log('\n测试4: 检查CORS配置');
    try {
      const corsTest = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'OPTIONS'
      });
      console.log('✓ CORS配置检查通过');
    } catch (error) {
      console.log('✗ CORS配置检查失败:', error.message);
      apiConnectionStatus.error = `CORS配置错误: ${error.message}`;
    }
    
    // 详细测试（如果启用）
    let endpointsTestResults = [];
    if (detailedTest && apiConnectionStatus.isConnected) {
      const endpointsToTest = [
        { endpoint: API_CONFIG.ENDPOINTS.FUNDS.GET_ALL, method: 'GET', moduleName: '基金管理' },
        { endpoint: API_CONFIG.ENDPOINTS.NEWS.GET_ALL, method: 'GET', moduleName: '新闻资讯' },
        { endpoint: API_CONFIG.ENDPOINTS.AUTH.LOGIN, method: 'POST', moduleName: '用户认证', options: { body: JSON.stringify({ username: 'test', password: 'test' }) } }
      ];
      
      endpointsTestResults = await testMultipleEndpoints(endpointsToTest);
    }
    
    // 自动切换数据模式（如果启用）
    if (autoSwitchMode) {
      await autoDetectDataMode();
    }
    
    // 记录最后检查时间
    apiConnectionStatus.lastChecked = new Date().toISOString();
    
    // 提供连接建议
    console.log('\n===========================================');
    console.log('✅ 连接测试完成！');
    console.log('当前连接状态:', apiConnectionStatus.isConnected ? '已连接' : '未连接');
    console.log('当前数据模式:', apiConnectionStatus.useMockData ? '模拟数据' : '真实API');
    
    if (!apiConnectionStatus.isConnected) {
      console.log('\n⚠️  连接问题排查指南:');
      console.log('1. 确认后端服务器是否已启动并运行');
      console.log('2. 检查网络连接是否正常');
      console.log('3. 验证API基础URL配置是否正确');
      console.log('4. 检查浏览器控制台是否有CORS相关错误');
      console.log('5. 确认后端CORS配置是否包含前端域名');
      console.log('6. 尝试清除浏览器缓存和Cookie后重试');
    }
    
    console.log('===========================================');
    
    return {
      success: apiConnectionStatus.isConnected,
      details: {
        networkTest,
        apiServerStatus,
        endpointsTestResults,
        connectionStatus: apiConnectionStatus
      }
    };
    
  } catch (error) {
    console.error('\n✗ API连接测试失败:', error.message);
    console.log('\n可能的原因:');
    console.log('1. 后端服务器未运行');
    console.log('2. 网络连接问题');
    console.log('3. CORS配置不正确');
    console.log('4. API地址配置错误');
    console.log('5. 防火墙或代理设置问题');
    
    // 更新连接状态
    apiConnectionStatus.isConnected = false;
    apiConnectionStatus.error = error.message;
    apiConnectionStatus.lastChecked = new Date().toISOString();
    
    // 自动切换到模拟数据模式
    if (autoSwitchMode) {
      toggleMockDataMode(true);
    }
    
    console.log('\n===========================================');
    console.log('当前已自动切换到模拟数据模式！');
    console.log('===========================================');
    
    return {
      success: false,
      details: {
        error: error.message,
        connectionStatus: apiConnectionStatus
      }
    };
  }
}

/**
 * 监控API连接状态
 * @param {number} interval - 监控间隔（毫秒）
 * @param {Function} callback - 状态变化时的回调函数
 * @returns {number} - 返回定时器ID
 */
export function monitorApiConnection(interval = 60000, callback) {
  console.log(`\n开始监控API连接状态，检查间隔: ${interval}ms`);
  
  const monitorInterval = setInterval(async () => {
    const previousStatus = apiConnectionStatus.isConnected;
    await autoDetectDataMode();
    
    // 如果状态发生变化，调用回调函数
    if (previousStatus !== apiConnectionStatus.isConnected && typeof callback === 'function') {
      callback(apiConnectionStatus);
    }
  }, interval);
  
  return monitorInterval;
}

/**
 * 停止监控API连接状态
 * @param {number} intervalId - 定时器ID
 */
export function stopMonitoringApiConnection(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('\n已停止监控API连接状态');
  }
}

// 导出测试函数，便于在浏览器控制台或其他地方调用
export { testApiConnection };

export default testApiConnection;