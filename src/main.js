// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
  // 初始化图表
  initCharts();
  
  // 初始化移动端菜单
  initMobileMenu();
  
  // 开始实时数据更新
  startRealtimeUpdates();
  
  // 初始化页面动画
  initPageAnimations();
});

// 初始化图表
function initCharts() {
  // 初始化净值趋势图
  initNetValueChart();
  
  // 初始化收益率分布图
  initReturnRateChart();
}

// 初始化净值趋势图
function initNetValueChart() {
  const ctx = document.getElementById('netValueChart').getContext('2d');
  
  window.netValueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: '环保新能源基金',
        data: [1.082, 1.083, 1.085, 1.087, 1.089, 1.088],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: '绿色科技创新基金',
        data: [1.250, 1.252, 1.256, 1.258, 1.255, 1.254],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.05)',
        tension: 0.4,
        fill: false
      }]
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
  const ctx = document.getElementById('returnRateChart').getContext('2d');
  
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
    // 更新净值趋势图的数据
    window.netValueChart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(value => {
        const randomChange = (Math.random() - 0.45) * 0.001;
        return (parseFloat(value) + randomChange).toFixed(3);
      });
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
