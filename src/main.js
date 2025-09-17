// 导入事件处理器
import { initEventHandlers } from './eventHandlers.js';
import authService from './authService.js';
import { mockData } from './mockData/index.js';

// 初始化页面
window.addEventListener('DOMContentLoaded', async () => {
  // 检查是否为登录/注册页面
  const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
  
  if (!isAuthPage) {
    // 非认证页面，检查用户是否已登录
    const isLoggedIn = authService.isAuthenticated() && authService.isTokenValid();
    
    if (!isLoggedIn) {
      // 用户未登录，跳转到登录页面
      window.location.href = '/login.html';
      return;
    }
    
    try {
      // 获取当前用户信息
      const user = await authService.getCurrentUser();
      if (user) {
        // 更新页面上的用户信息
        updateUserInfo(user);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }
  
  // 初始化图表
  initCharts();
  
  // 初始化移动端菜单
  initMobileMenu();
  
  // 开始实时数据更新
  startRealtimeUpdates();
  
  // 初始化页面动画
  initPageAnimations();
  
  // 初始化事件处理器
  initEventHandlers();
});

/**
 * 更新页面上的用户信息
 * @param {Object} user - 用户信息
 */
function updateUserInfo(user) {
  // 更新顶部导航栏的用户信息
  const userAvatar = document.querySelector('.header-user-avatar');
  const userName = document.querySelector('.header-user-name');
  
  if (userAvatar && user.name) {
    // 使用用户名首字母作为头像
    const initial = user.name.charAt(0).toUpperCase();
    userAvatar.textContent = initial;
  }
  
  if (userName && user.name) {
    userName.textContent = user.name;
  }
  
  // 如果需要，可以根据用户角色显示/隐藏特定的菜单项
  if (user.role) {
    updateMenuByRole(user.role);
  }
}

/**
 * 根据用户角色更新菜单
 * @param {string} role - 用户角色
 */
function updateMenuByRole(role) {
  // 根据角色显示或隐藏特定菜单
  // 这里可以根据实际需求进行扩展
  console.log('用户角色:', role);
}

// 初始化图表
function initCharts() {
  // 初始化净值趋势图
  initNetValueChart();
  
  // 初始化收益率分布图
  initReturnRateChart();
}

// 初始化净值趋势图
function initNetValueChart() {
  const chartElement = document.getElementById('netValueChart');
  if (!chartElement) return; // 如果元素不存在，直接返回
  
  const ctx = chartElement.getContext('2d');
  
  // 从模拟数据中获取基金数据
  const fundData = mockData.funds.slice(0, 3).map(fund => ({
    label: fund.name,
    data: generateRandomValues(6, parseFloat(fund.nav), 0.005),
    borderColor: fund.color || getRandomColor(),
    backgroundColor: `${fund.color || getRandomColor()}20`,
    tension: 0.4,
    fill: Math.random() > 0.5
  }));
  
  window.netValueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: fundData
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// 初始化收益率分布图
function initReturnRateChart() {
  const chartElement = document.getElementById('returnRateChart');
  if (!chartElement) return; // 如果元素不存在，直接返回
  
  const ctx = chartElement.getContext('2d');
  
  window.returnRateChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['0-5%', '5-10%', '10-15%', '15-20%', '20%以上'],
      datasets: [{
        data: [8, 15, 12, 8, 5],
        backgroundColor: [
          '#34D399',
          '#10B981',
          '#059669',
          '#047857',
          '#065F46'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
}

// 初始化移动端菜单
function initMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  
  mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    
    // 切换按钮图标
    const icon = mobileMenuButton.querySelector('i');
    if (sidebar.classList.contains('-translate-x-full')) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    } else {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
  });
  
  // 点击侧边栏以外的区域关闭侧边栏
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target) && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
      sidebar.classList.add('-translate-x-full');
      const icon = mobileMenuButton.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// 开始实时数据更新
function startRealtimeUpdates() {
  // 定期更新数据
  setInterval(() => {
    updateLastUpdateTime();
    updateFundValues();
    updateCharts();
  }, 30000); // 30秒更新一次
}

// 更新最后更新时间
function updateLastUpdateTime() {
  const now = new Date();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const updateTime = `${now.getHours()}:${minutes}:${seconds}`;
  
  // 更新系统运行时间卡片中的最后更新时间
  const systemUptimeCard = document.querySelector('.grid .bg-white:nth-child(4) .mt-4 span');
  if (systemUptimeCard) {
    systemUptimeCard.textContent = `最近更新: ${updateTime}`;
  }
}

// 生成基于基础值的随机值数组
function generateRandomValues(count, baseValue, variation) {
  return Array.from({ length: count }, () => {
    const randomChange = (Math.random() - 0.5) * variation;
    return (baseValue + randomChange).toFixed(3);
  });
}

// 生成随机颜色
function getRandomColor() {
  const colors = ['#10B981', '#059669', '#047857', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#EF4444'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 更新基金净值
function updateFundValues() {
  // 获取表格中的所有基金行
  const fundRows = document.querySelectorAll('tbody tr');
  
  fundRows.forEach(row => {
    // 获取当前净值单元格
    const valueCell = row.querySelector('td:nth-child(2)');
    const changeCell = row.querySelector('td:nth-child(3)');
    
    if (valueCell && changeCell) {
      // 生成随机变化值
      const randomChange = (Math.random() - 0.45) * 0.005;
      const currentValue = parseFloat(valueCell.textContent);
      const newValue = (currentValue + randomChange).toFixed(3);
      const changePercentage = (randomChange * 100).toFixed(2);
      
      // 更新净值
      valueCell.textContent = newValue;
      
      // 更新涨跌幅和颜色
      if (randomChange >= 0) {
        changeCell.textContent = `+${changePercentage}%`;
        changeCell.className = 'py-3 px-4 text-right text-sm text-success';
      } else {
        changeCell.textContent = `${changePercentage}%`;
        changeCell.className = 'py-3 px-4 text-right text-sm text-danger';
      }
    }
  });
}

// 更新图表数据
function updateCharts() {
  if (window.netValueChart) {
    // 使用模拟数据更新净值趋势图
    mockData.funds.slice(0, 3).forEach((fund, index) => {
      if (window.netValueChart.data.datasets[index]) {
        window.netValueChart.data.datasets[index].data = generateRandomValues(6, parseFloat(fund.nav), 0.005);
      }
    });
    
    window.netValueChart.update();
  }
}

// 初始化页面动画
function initPageAnimations() {
  // 添加滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        entry.target.classList.add('animate-slide-up');
      }
    });
  }, { threshold: 0.1 });
  
  // 为所有卡片和重要内容添加动画
  document.querySelectorAll('.hover-lift, .page-content > div').forEach(el => {
    observer.observe(el);
  });
}

// 添加一些全局样式动画
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.page-content {
  animation: fadeIn 0.5s ease-in-out, slideUp 0.6s ease-out;
}
`;
document.head.appendChild(style);
