// Alert组件
/**
 * 创建提示框组件
 * @param {Object} options - 提示框配置选项
 * @param {string} options.type - 提示框类型 (success, error, warning, info)
 * @param {string} options.message - 提示框消息内容
 * @param {boolean} options.showCloseButton - 是否显示关闭按钮
 * @param {number} options.autoClose - 自动关闭时间（毫秒），0表示不自动关闭
 * @param {string} options.position - 提示框位置
 * @param {string} options.className - 额外的CSS类名
 * @param {Function} options.onClose - 提示框关闭回调
 * @returns {Object} 包含alert元素和控制方法的对象
 */
export function createAlert({ 
  type = 'info', 
  message = '', 
  showCloseButton = true, 
  autoClose = 0, 
  position = 'top-right', 
  className = '', 
  onClose = () => {} 
}) {
  // 创建提示框容器
  const alertContainer = document.createElement('div');
  
  // 设置基础样式
  let alertClasses = 'p-4 rounded-md flex items-start space-x-3 shadow-lg z-50 max-w-md transition-all duration-300 ease-in-out';
  
  // 根据类型设置不同的样式
  switch (type) {
    case 'success':
      alertClasses += ' bg-green-50 border border-green-200 text-green-800';
      break;
    case 'error':
      alertClasses += ' bg-red-50 border border-red-200 text-red-800';
      break;
    case 'warning':
      alertClasses += ' bg-yellow-50 border border-yellow-200 text-yellow-800';
      break;
    case 'info':
    default:
      alertClasses += ' bg-blue-50 border border-blue-200 text-blue-800';
  }
  
  // 添加自定义类名
  if (className) {
    alertClasses += ' ' + className;
  }
  
  alertContainer.className = alertClasses;
  
  // 创建图标
  const icon = document.createElement('div');
  icon.className = 'flex-shrink-0 mt-0.5';
  
  // 根据类型设置不同的图标
  switch (type) {
    case 'success':
      icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
      break;
    case 'error':
      icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
      break;
    case 'warning':
      icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
      break;
    case 'info':
      icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      break;
  }
  
  // 创建消息内容
  const messageContainer = document.createElement('div');
  messageContainer.className = 'flex-1';
  
  if (typeof message === 'string') {
    messageContainer.innerHTML = message;
  } else if (message instanceof HTMLElement) {
    messageContainer.appendChild(message);
  }
  
  // 添加关闭按钮
  const closeButtonContainer = document.createElement('div');
  closeButtonContainer.className = 'flex-shrink-0';
  
  if (showCloseButton) {
    const closeButton = document.createElement('button');
    closeButton.className = 'ml-3 bg-transparent rounded-md inline-flex text-sm leading-5 font-medium focus:outline-none';
    closeButton.innerHTML = '<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
    
    closeButton.addEventListener('click', () => {
      close();
    });
    
    closeButtonContainer.appendChild(closeButton);
  }
  
  // 添加到提示框容器
  alertContainer.appendChild(icon);
  alertContainer.appendChild(messageContainer);
  alertContainer.appendChild(closeButtonContainer);
  
  // 设置位置样式
  let positionStyles = '';
  
  switch (position) {
    case 'top-right':
      positionStyles = 'position: fixed; top: 20px; right: 20px;';
      break;
    case 'top-left':
      positionStyles = 'position: fixed; top: 20px; left: 20px;';
      break;
    case 'bottom-right':
      positionStyles = 'position: fixed; bottom: 20px; right: 20px;';
      break;
    case 'bottom-left':
      positionStyles = 'position: fixed; bottom: 20px; left: 20px;';
      break;
    case 'top-center':
      positionStyles = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%);';
      break;
    case 'bottom-center':
      positionStyles = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);';
      break;
    default:
      positionStyles = 'position: fixed; top: 20px; right: 20px;';
  }
  
  alertContainer.setAttribute('style', positionStyles);
  
  // 添加到页面
  document.body.appendChild(alertContainer);
  
  // 设置显示动画
  setTimeout(() => {
    alertContainer.classList.add('opacity-100');
    alertContainer.classList.remove('opacity-0', 'translate-y-[-20px]');
  }, 10);
  
  // 自动关闭定时器
  let autoCloseTimer = null;
  
  if (autoClose > 0) {
    autoCloseTimer = setTimeout(() => {
      close();
    }, autoClose);
  }
  
  // 关闭提示框
  function close() {
    // 清除自动关闭定时器
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    
    // 添加关闭动画
    alertContainer.classList.add('opacity-0', 'translate-y-[-20px]');
    
    // 动画完成后移除元素
    setTimeout(() => {
      if (alertContainer && alertContainer.parentNode) {
        alertContainer.parentNode.removeChild(alertContainer);
      }
      onClose();
    }, 300);
  }
  
  // 更新消息内容
  function updateMessage(newMessage) {
    messageContainer.innerHTML = '';
    
    if (typeof newMessage === 'string') {
      messageContainer.innerHTML = newMessage;
    } else if (newMessage instanceof HTMLElement) {
      messageContainer.appendChild(newMessage);
    }
  }
  
  // 更新提示框类型
  function updateType(newType) {
    // 移除旧的类型样式
    alertContainer.classList.remove(
      'bg-green-50', 'border-green-200', 'text-green-800',
      'bg-red-50', 'border-red-200', 'text-red-800',
      'bg-yellow-50', 'border-yellow-200', 'text-yellow-800',
      'bg-blue-50', 'border-blue-200', 'text-blue-800'
    );
    
    // 根据新类型设置样式
    switch (newType) {
      case 'success':
        alertContainer.classList.add('bg-green-50', 'border-green-200', 'text-green-800');
        break;
      case 'error':
        alertContainer.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
        break;
      case 'warning':
        alertContainer.classList.add('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
        break;
      case 'info':
      default:
        alertContainer.classList.add('bg-blue-50', 'border-blue-200', 'text-blue-800');
    }
    
    // 更新图标
    switch (newType) {
      case 'success':
        icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        break;
      case 'error':
        icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
        break;
      case 'warning':
        icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
        break;
      case 'info':
        icon.innerHTML = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        break;
    }
  }
  
  // 立即关闭提示框（无动画）
  function destroy() {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }
    
    if (alertContainer && alertContainer.parentNode) {
      alertContainer.parentNode.removeChild(alertContainer);
    }
    
    onClose();
  }
  
  return {
    alert: alertContainer,
    close,
    updateMessage,
    updateType,
    destroy
  };
}

// 快捷创建不同类型的提示框
export const Alert = {
  success(message, options = {}) {
    return createAlert({
      type: 'success',
      message,
      ...options
    });
  },
  error(message, options = {}) {
    return createAlert({
      type: 'error',
      message,
      ...options
    });
  },
  warning(message, options = {}) {
    return createAlert({
      type: 'warning',
      message,
      ...options
    });
  },
  info(message, options = {}) {
    return createAlert({
      type: 'info',
      message,
      ...options
    });
  }
};