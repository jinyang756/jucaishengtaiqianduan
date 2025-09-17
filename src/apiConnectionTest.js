// 前端与后端连接测试脚本
// 用于验证已配置的前后端通信是否正常

import API_CONFIG from './apiConfig.js';
import apiService from './apiService.js';

/**
 * 测试前后端API连接
 */
async function testApiConnection() {
  console.log('开始测试前后端API连接...');
  console.log('当前使用的API基础URL:', API_CONFIG.BASE_URL);
  console.log('前端域名:', window.location.origin);
  
  try {
    // 测试1: 发送一个简单的GET请求到基础API地址
    console.log('\n测试1: 检查API服务器可访问性');
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✓ API服务器可访问，状态码:', response.status);
    } else {
      console.log('✗ API服务器返回非成功状态码:', response.status);
    }
    
    // 测试2: 尝试访问一个公共API端点（如果有）
    // 注意：根据实际API结构调整此端点
    console.log('\n测试2: 尝试访问认证API端点');
    try {
      // 使用apiService的内部方法来测试基础连接
      const result = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'OPTIONS' // 使用OPTIONS方法来测试CORS配置
      });
      console.log('✓ 认证API端点CORS检查通过');
    } catch (error) {
      console.log('✗ 认证API端点CORS检查失败:', error.message);
    }
    
    // 测试3: 检查环境变量配置
    console.log('\n测试3: 检查环境变量配置');
    console.log('VITE_API_URL环境变量:', import.meta.env.VITE_API_URL || '未设置');
    
    // 提供连接建议
    console.log('\n连接测试完成！');
    console.log('===========================================');
    console.log('如果测试中遇到CORS错误，请检查以下几点:');
    console.log('1. 后端是否已正确设置FRONTEND_URL环境变量');
    console.log('2. 后端的CORS中间件是否配置正确');
    console.log('3. 前端的API基础URL是否指向正确的后端地址');
    console.log('===========================================');
    
  } catch (error) {
    console.error('\n✗ API连接测试失败:', error.message);
    console.log('\n可能的原因:');
    console.log('1. 后端服务器未运行');
    console.log('2. 网络连接问题');
    console.log('3. CORS配置不正确');
    console.log('4. API地址配置错误');
  }
}

// 导出测试函数，便于在浏览器控制台或其他地方调用
export { testApiConnection };

export default testApiConnection;