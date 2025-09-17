// 事件处理文件
import apiService from './apiService.js';
import authService from './authService.js';

/**
 * 初始化所有事件处理器
 */
export function initEventHandlers() {
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
    
    // 初始化移动菜单点击事件
    initMobileMenu();
    
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
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('#mobileMenuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      sidebar.classList.toggle('block');
    });
  }
}

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
  Promise.all([
    apiService.funds.getAll(),
    apiService.news.getAll(),
    apiService.calculation.getStatus()
  ]).then(([fundsData, newsData, calculationData]) => {
    console.log('仪表板数据已加载');
    console.log('基金数据:', fundsData);
    console.log('新闻数据:', newsData);
    console.log('计算引擎数据:', calculationData);
    
    // 这里可以实现更新仪表板数据的逻辑
  });
}

/**
 * 加载基金数据
 */
function loadFundsData() {
  apiService.funds.getAll().then(data => {
    console.log('基金数据已加载', data);
    
    // 这里可以实现更新基金列表的逻辑
  });
}

/**
 * 加载新闻数据
 */
function loadNewsData() {
  apiService.news.getAll().then(data => {
    console.log('新闻数据已加载', data);
    
    // 这里可以实现更新新闻列表的逻辑
  });
}

/**
 * 加载规则数据
 */
function loadRulesData() {
  apiService.rules.getAll().then(data => {
    console.log('规则数据已加载', data);
    
    // 这里可以实现更新规则列表的逻辑
  });
}

/**
 * 加载计算引擎数据
 */
function loadCalculationEngineData() {
  apiService.calculation.getStatus().then(data => {
    console.log('计算引擎数据已加载', data);
    
    // 这里可以实现更新计算引擎状态的逻辑
  });
}