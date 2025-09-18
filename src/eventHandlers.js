// 事件处理文件
import apiService from './apiService.js';
import authService from './authService.js';
import { mockData } from './mockData/index.js';

// 添加防重复绑定标记
let isEventHandlersInitialized = false;

/**
 * 初始化所有事件处理器
 */
export function initEventHandlers() {
  // 防止事件处理器重复绑定
  if (isEventHandlersInitialized) return;
  isEventHandlersInitialized = true;
  
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', () => {
    // 初始化侧边栏导航点击事件
    initSidebarNavigation();
    
    // 初始化顶部导航栏点击事件
    initTopNavigation();
    
    // 初始化仪表板卡片点击事件
    initDashboardCards();
    
    // 初始化基金表格点击事件
    initFundTable();
    
    // 初始化新闻列表点击事件
    initNewsList();
    
    // 移动端菜单已在main.js中统一实现，此处不再重复初始化
    // 初始化计算引擎控制面板
    initCalculationPanel();
    
    // 初始化模态框事件
    initModals();
    
    // 初始化用户认证相关事件
    initAuthEvents();
    
    console.log('所有事件处理器已初始化完成');
  });
}

/**
 * 初始化侧边栏导航点击事件
 */
function initSidebarNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 获取目标页面ID
      const targetPage = link.getAttribute('href')?.replace('#', '') || 'dashboard';
      
      // 移除所有活动状态
      sidebarLinks.forEach(item => {
        item.classList.remove('bg-blue-100', 'text-blue-600');
      });
      
      // 设置当前链接为活动状态
      link.classList.add('bg-blue-100', 'text-blue-600');
      
      // 显示加载状态
      showLoadingIndicator();
      
      // 模拟页面加载延迟
      setTimeout(() => {
        loadPageContent(targetPage);
        hideLoadingIndicator();
      }, 300);
    });
  });
}

/**
 * 初始化顶部导航栏点击事件
 */
function initTopNavigation() {
  // 搜索按钮点击事件
  const searchButton = document.querySelector('#searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchInput = document.querySelector('#searchInput');
      if (searchInput && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  }
  
  // 搜索框回车事件
  const searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  }
  
  // 通知按钮点击事件
  const notificationButton = document.querySelector('#notificationButton');
  if (notificationButton) {
    notificationButton.addEventListener('click', () => {
      toggleNotificationDropdown();
    });
  }
  
  // 管理员菜单点击事件
  const adminButton = document.querySelector('#adminButton');
  if (adminButton) {
    adminButton.addEventListener('click', () => {
      toggleAdminDropdown();
    });
  }
}

/**
 * 初始化仪表板卡片点击事件
 */
function initDashboardCards() {
  const cards = document.querySelectorAll('.dashboard-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardTitle = card.querySelector('.card-title')?.textContent || '';
      
      // 根据卡片类型执行不同操作
      if (cardTitle.includes('总基金数量')) {
        navigateToPage('funds');
      } else if (cardTitle.includes('平均收益率')) {
        navigateToPage('performance');
      } else if (cardTitle.includes('活跃规则数')) {
        navigateToPage('rules');
      } else if (cardTitle.includes('计算引擎状态')) {
        showCalculationEngineStatus();
      }
    });
  });
}

/**
 * 初始化基金表格点击事件
 */
function initFundTable() {
  const tableRows = document.querySelectorAll('table.fund-table tbody tr');
  
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      const fundId = row.dataset.fundId;
      const fundName = row.querySelector('td:first-child')?.textContent || '';
      
      if (fundId) {
        showFundDetail(fundId, fundName);
      }
    });
  });
}

/**
 * 初始化新闻列表点击事件
 */
function initNewsList() {
  const newsItems = document.querySelectorAll('.news-item');
  
  newsItems.forEach(item => {
    item.addEventListener('click', () => {
      const newsId = item.dataset.newsId;
      const newsTitle = item.querySelector('.news-title')?.textContent || '';
      
      if (newsId) {
        showNewsDetail(newsId, newsTitle);
      }
    });
  });
}

/**
 * 初始化移动菜单点击事件
 */
// 移动端菜单功能已在main.js中统一实现，此处不再重复定义
// function initMobileMenu() { ... }

/**
 * 初始化计算引擎控制面板
 */
function initCalculationPanel() {
  const calculationPanel = document.querySelector('#calculationPanel');
  if (calculationPanel) {
    const runCalculationButton = calculationPanel.querySelector('#runCalculationButton');
    const viewLogButton = calculationPanel.querySelector('#viewLogButton');
    
    if (runCalculationButton) {
      runCalculationButton.addEventListener('click', () => {
        runCalculation();
      });
    }
    
    if (viewLogButton) {
      viewLogButton.addEventListener('click', () => {
        showCalculationLogs();
      });
    }
  }
}

/**
 * 初始化模态框事件
 */
function initModals() {
  const closeButtons = document.querySelectorAll('.modal-close');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

/**
 * 初始化用户认证相关事件
 */
function initAuthEvents() {
  // 查找注销按钮
  const logoutButton = document.querySelector('.logout-btn');
  const userMenuButton = document.querySelector('.header-user-info');
  const userMenu = document.querySelector('.user-dropdown-menu');
  
  // 初始化注销功能
  if (logoutButton) {
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      try {
        // 调用authService的注销方法
        await authService.logout();
        
        // 清除用户信息
        document.querySelector('.header-user-avatar').textContent = '';
        document.querySelector('.header-user-name').textContent = '';
        
        // 跳转到登录页面
        window.location.href = '/login.html';
      } catch (error) {
        console.error('注销失败:', error);
        alert('注销失败，请稍后重试');
      }
    });
  }
  
  // 初始化用户菜单交互
  if (userMenuButton && userMenu) {
    // 点击用户信息区域显示/隐藏菜单
    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      userMenu.classList.toggle('hidden');
    });
    
    // 点击页面其他地方隐藏菜单
    document.addEventListener('click', () => {
      userMenu.classList.add('hidden');
    });
    
    // 阻止点击菜单内部时事件冒泡
    userMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
  
  // 初始化密码修改按钮（如果存在）
  const changePasswordButton = document.querySelector('.change-password-btn');
  if (changePasswordButton) {
    changePasswordButton.addEventListener('click', () => {
      // 这里可以打开密码修改模态框
      alert('打开密码修改功能');
    });
  }
}

/**
 * 加载页面内容
 */
function loadPageContent(pageId) {
  // 这里可以根据实际需求实现页面内容加载逻辑
  console.log(`加载页面: ${pageId}`);
  
  // 更新页面标题
  updatePageTitle(pageId);
  
  // 模拟页面切换效果
  const contentArea = document.querySelector('.content-area');
  if (contentArea) {
    contentArea.style.opacity = '0.5';
    contentArea.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      contentArea.style.opacity = '1';
    }, 300);
  }
  
  // 根据页面ID加载对应的数据
  switch (pageId) {
    case 'dashboard':
      loadDashboardData();
      break;
    case 'funds':
      loadFundsData();
      break;
    case 'news':
      loadNewsData();
      break;
    case 'rules':
      loadRulesData();
      break;
    case 'calculation':
      loadCalculationEngineData();
      break;
    default:
      loadDashboardData();
  }
}

/**
 * 导航到指定页面
 */
function navigateToPage(pageId) {
  // 设置URL哈希
  window.location.hash = pageId;
  
  // 触发链接点击事件
  const targetLink = document.querySelector(`.sidebar-nav a[href="#${pageId}"]`);
  if (targetLink) {
    targetLink.click();
  }
}

/**
 * 显示加载指示器
 */
function showLoadingIndicator() {
  let loadingIndicator = document.querySelector('#loadingIndicator');
  
  if (!loadingIndicator) {
    loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingIndicator';
    loadingIndicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingIndicator.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-700">加载中...</p>
      </div>
    `;
    document.body.appendChild(loadingIndicator);
  } else {
    loadingIndicator.classList.remove('hidden');
  }
}

/**
 * 隐藏加载指示器
 */
function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector('#loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * 更新页面标题
 */
function updatePageTitle(pageId) {
  const pageTitleElement = document.querySelector('.page-header h1');
  if (pageTitleElement) {
    const titles = {
      dashboard: '仪表板',
      funds: '基金管理',
      news: '新闻分析',
      rules: '规则管理',
      calculation: '计算引擎',
      performance: '绩效分析'
    };
    
    pageTitleElement.textContent = titles[pageId] || '聚财生态基金管理系统';
  }
}

/**
 * 执行搜索操作
 */
function performSearch(keyword) {
  console.log(`执行搜索: ${keyword}`);
  showNotification(`搜索: ${keyword}`, 'info');
  
  // 这里可以实现搜索逻辑
}

/**
 * 切换通知下拉菜单
 */
function toggleNotificationDropdown() {
  const notificationDropdown = document.querySelector('#notificationDropdown');
  if (notificationDropdown) {
    notificationDropdown.classList.toggle('hidden');
  }
}

/**
 * 切换管理员下拉菜单
 */
function toggleAdminDropdown() {
  const adminDropdown = document.querySelector('#adminDropdown');
  if (adminDropdown) {
    adminDropdown.classList.toggle('hidden');
  }
}

/**
 * 显示基金详情
 */
function showFundDetail(fundId, fundName) {
  console.log(`查看基金详情: ${fundName} (ID: ${fundId})`);
  showNotification(`查看基金: ${fundName}`, 'info');
  
  // 加载基金详情数据
  apiService.funds.getById(fundId).then(data => {
    // 这里可以实现显示基金详情的逻辑
    console.log('基金详情数据:', data);
  });
}

/**
 * 显示新闻详情
 */
function showNewsDetail(newsId, newsTitle) {
  console.log(`查看新闻详情: ${newsTitle} (ID: ${newsId})`);
  showNotification(`查看新闻: ${newsTitle}`, 'info');
  
  // 加载新闻详情数据
  apiService.news.getById(newsId).then(data => {
    // 这里可以实现显示新闻详情的逻辑
    console.log('新闻详情数据:', data);
  });
}

/**
 * 显示计算引擎状态
 */
function showCalculationEngineStatus() {
  apiService.calculation.getStatus().then(data => {
    const status = data.data || { status: '未知', currentTask: '无', successRate: '0%', averageTime: '0s' };
    
    showNotification(`计算引擎状态: ${status.status}\n当前任务: ${status.currentTask}\n成功率: ${status.successRate}\n平均时间: ${status.averageTime}`, 'info', 5000);
  });
}

/**
 * 运行计算引擎
 */
function runCalculation() {
  showLoadingIndicator();
  
  // 模拟计算过程
  setTimeout(() => {
    hideLoadingIndicator();
    showNotification('计算引擎已启动', 'success');
  }, 1500);
}

/**
 * 显示计算日志
 */
function showCalculationLogs() {
  console.log('显示计算日志');
  showNotification('显示计算引擎日志', 'info');
  
  // 这里可以实现显示计算日志的逻辑
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info', duration = 3000) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
  
  // 设置通知样式
  switch (type) {
    case 'success':
      notification.classList.add('bg-green-500', 'text-white');
      break;
    case 'error':
      notification.classList.add('bg-red-500', 'text-white');
      break;
    case 'warning':
      notification.classList.add('bg-yellow-500', 'text-white');
      break;
    default:
      notification.classList.add('bg-blue-500', 'text-white');
  }
  
  // 设置通知内容
  notification.innerHTML = message.replace(/\\n/g, '<br>');
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 显示通知
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 10);
  
  // 自动隐藏通知
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

/**
 * 加载仪表板数据
 */
function loadDashboardData() {
  const fundsData = mockData.funds.slice(0, 5);
  const newsData = mockData.news.slice(0, 5);
  const calculationData = {
    status: '运行中',
    currentTask: '基金净值计算',
    successRate: '98.5%',
    averageTime: '25.3s'
  };
  
  console.log('仪表板数据已加载(使用模拟数据)');
  
  // 更新仪表板统计卡片
  updateDashboardCards(fundsData, calculationData);
  
  // 更新基金表格
  updateFundTable(fundsData);
  
  // 更新新闻列表
  updateNewsList(newsData);
}

/**
 * 更新仪表板统计卡片
 */
function updateDashboardCards(fundsData, calculationData) {
  // 计算统计数据
  const totalFunds = fundsData.length;
  const avgReturnRate = fundsData.reduce((sum, fund) => sum + parseFloat(fund.dailyReturn), 0) / totalFunds;
  const activeRules = Math.floor(Math.random() * 50) + 10; // 模拟活跃规则数
  
  // 更新卡片内容
  document.querySelector('#totalFundsCount').textContent = totalFunds;
  document.querySelector('#avgReturnRate').textContent = avgReturnRate.toFixed(2) + '%';
  document.querySelector('#activeRulesCount').textContent = activeRules;
  document.querySelector('#engineStatus').textContent = calculationData.status;
  document.querySelector('#currentTask').textContent = calculationData.currentTask;
}

/**
 * 更新基金表格
 */
function updateFundTable(fundsData) {
  const tableBody = document.querySelector('.fund-table tbody');
  if (!tableBody) return;
  
  // 清空表格
  tableBody.innerHTML = '';
  
  // 添加数据行
  fundsData.forEach(fund => {
    const row = document.createElement('tr');
    row.dataset.fundId = fund.id;
    row.className = 'hover:bg-gray-50 cursor-pointer';
    
    row.innerHTML = `
      <td class="py-3 px-4 border-b">${fund.name}</td>
      <td class="py-3 px-4 border-b">${fund.type}</td>
      <td class="py-3 px-4 border-b">${fund.nav}</td>
      <td class="py-3 px-4 border-b text-green-600">${fund.dailyReturn}</td>
      <td class="py-3 px-4 border-b text-green-600">${fund.weeklyReturn}</td>
      <td class="py-3 px-4 border-b text-green-600">${fund.monthlyReturn}</td>
      <td class="py-3 px-4 border-b">${fund.manager}</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // 重新初始化表格点击事件
  initFundTable();
}

/**
 * 更新新闻列表
 */
function updateNewsList(newsData) {
  const newsList = document.querySelector('.news-list');
  if (!newsList) return;
  
  // 清空列表
  newsList.innerHTML = '';
  
  // 添加新闻项
  newsData.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item p-4 border-b hover:bg-gray-50 cursor-pointer';
    newsItem.dataset.newsId = news.id;
    
    newsItem.innerHTML = `
      <h3 class="news-title text-lg font-medium mb-1">${news.title}</h3>
      <p class="text-sm text-gray-600 mb-2">${news.content.substring(0, 100)}...</p>
      <div class="flex justify-between text-xs text-gray-500">
        <span>${news.category}</span>
        <span>${news.publishDate}</span>
      </div>
    `;
    
    newsList.appendChild(newsItem);
  });
  
  // 重新初始化新闻列表点击事件
  initNewsList();
}

/**
 * 加载基金数据
 */
function loadFundsData() {
  const fundsData = mockData.funds;
  console.log('基金数据已加载(使用模拟数据)', fundsData);
  
  // 更新基金表格
  updateFundTable(fundsData);
}

/**
 * 加载新闻数据
 */
function loadNewsData() {
  const newsData = mockData.news;
  console.log('新闻数据已加载(使用模拟数据)', newsData);
  
  // 更新新闻列表
  updateNewsList(newsData);
}

/**
 * 加载规则数据
 */
function loadRulesData() {
  // 模拟规则数据
  const rulesData = [
    { id: 'rule_001', name: '风险控制规则', description: '当日亏损超过2%自动减仓', status: 'active' },
    { id: 'rule_002', name: '收益保护规则', description: '年化收益超过15%锁定50%收益', status: 'active' },
    { id: 'rule_003', name: '流动性管理规则', description: '确保基金现金比例不低于5%', status: 'active' },
    { id: 'rule_004', name: '行业分散规则', description: '单一行业配置不超过总资产30%', status: 'inactive' },
    { id: 'rule_005', name: '止损规则', description: '单只股票亏损超过10%强制止损', status: 'active' }
  ];
  
  console.log('规则数据已加载(使用模拟数据)', rulesData);
  
  // 更新规则表格
  updateRulesTable(rulesData);
}

/**
 * 更新规则表格
 */
function updateRulesTable(rulesData) {
  // 获取或创建规则表格
  let rulesTable = document.querySelector('.rules-table');
  const contentArea = document.querySelector('.content-area');
  
  if (!rulesTable && contentArea) {
    // 如果没有规则表格，创建一个
    rulesTable = document.createElement('table');
    rulesTable.className = 'rules-table w-full border-collapse';
    
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
      <tr class="bg-gray-100">
        <th class="py-2 px-4 border border-gray-300 text-left">规则名称</th>
        <th class="py-2 px-4 border border-gray-300 text-left">描述</th>
        <th class="py-2 px-4 border border-gray-300 text-left">状态</th>
      </tr>
    `;
    
    const tableBody = document.createElement('tbody');
    
    rulesTable.appendChild(tableHeader);
    rulesTable.appendChild(tableBody);
    
    // 清空内容区域并添加表格
    contentArea.innerHTML = '<h2 class="text-2xl font-bold mb-4">规则管理</h2>';
    contentArea.appendChild(rulesTable);
  }
  
  // 更新表格数据
  const tableBody = rulesTable?.querySelector('tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  rulesData.forEach(rule => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    row.dataset.ruleId = rule.id;
    
    row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300">${rule.name}</td>
      <td class="py-2 px-4 border border-gray-300">${rule.description}</td>
      <td class="py-2 px-4 border border-gray-300">
        <span class="inline-block px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
          ${rule.status === 'active' ? '活跃' : '非活跃'}
        </span>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

/**
 * 加载计算引擎数据
 */
function loadCalculationEngineData() {
  // 模拟计算引擎数据
  const engineData = {
    status: '运行中',
    currentTask: '基金净值计算',
    successRate: '98.5%',
    averageTime: '25.3s',
    lastCalculation: '2023-06-15 14:30:00',
    nextCalculation: '2023-06-15 18:00:00',
    tasks: [
      { id: 'task_001', name: '基金净值计算', status: 'completed', duration: '23.5s', timestamp: '2023-06-15 14:30:00' },
      { id: 'task_002', name: '风险评估', status: 'completed', duration: '18.2s', timestamp: '2023-06-15 14:25:00' },
      { id: 'task_003', name: '收益分析', status: 'completed', duration: '15.7s', timestamp: '2023-06-15 14:20:00' },
      { id: 'task_004', name: '流动性检查', status: 'completed', duration: '10.3s', timestamp: '2023-06-15 14:15:00' }
    ]
  };
  
  console.log('计算引擎数据已加载(使用模拟数据)', engineData);
  
  // 更新计算引擎状态
  updateCalculationEngineUI(engineData);
}

/**
 * 更新计算引擎UI
 */
function updateCalculationEngineUI(engineData) {
  const contentArea = document.querySelector('.content-area');
  if (!contentArea) return;
  
  // 创建计算引擎状态UI
  contentArea.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">计算引擎</h2>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">引擎状态</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="text-sm text-gray-500 mb-1">当前状态</div>
          <div class="text-lg font-medium ${engineData.status === '运行中' ? 'text-green-600' : 'text-red-600'}">${engineData.status}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="text-sm text-gray-500 mb-1">当前任务</div>
          <div class="text-lg font-medium">${engineData.currentTask}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="text-sm text-gray-500 mb-1">成功率</div>
          <div class="text-lg font-medium">${engineData.successRate}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="text-sm text-gray-500 mb-1">平均耗时</div>
          <div class="text-lg font-medium">${engineData.averageTime}</div>
        </div>
      </div>
      
      <div class="flex justify-between items-center">
        <div>
          <div class="text-sm text-gray-500">上次计算时间: ${engineData.lastCalculation}</div>
          <div class="text-sm text-gray-500">下次计算时间: ${engineData.nextCalculation}</div>
        </div>
        <button id="runCalculationButton" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          立即计算
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-4">最近任务记录</h3>
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border border-gray-300 text-left">任务名称</th>
            <th class="py-2 px-4 border border-gray-300 text-left">状态</th>
            <th class="py-2 px-4 border border-gray-300 text-left">耗时</th>
            <th class="py-2 px-4 border border-gray-300 text-left">时间</th>
          </tr>
        </thead>
        <tbody id="engineTasksTableBody">
          <!-- 任务记录会动态添加到这里 -->
        </tbody>
      </table>
      <div class="mt-4 flex justify-center">
        <button id="viewLogButton" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          查看完整日志
        </button>
      </div>
    </div>
  `;
  
  // 更新任务表格
  const tasksTableBody = document.querySelector('#engineTasksTableBody');
  if (tasksTableBody) {
    engineData.tasks.forEach(task => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      
      row.innerHTML = `
        <td class="py-2 px-4 border border-gray-300">${task.name}</td>
        <td class="py-2 px-4 border border-gray-300">
          <span class="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-800">
            ${task.status}
          </span>
        </td>
        <td class="py-2 px-4 border border-gray-300">${task.duration}</td>
        <td class="py-2 px-4 border border-gray-300">${task.timestamp}</td>
      `;
      
      tasksTableBody.appendChild(row);
    });
  }
  
  // 重新初始化计算引擎控制面板
  initCalculationPanel();
}