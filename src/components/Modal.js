// Modal组件
/**
 * 创建模态框组件
 * @param {Object} options - 模态框配置选项
 * @param {string} options.title - 模态框标题
 * @param {string|HTMLElement} options.content - 模态框内容
 * @param {boolean} options.showCloseButton - 是否显示关闭按钮
 * @param {boolean} options.showFooter - 是否显示底部
 * @param {Array} options.buttons - 按钮配置
 * @param {boolean} options.backdropClose - 点击背景是否关闭模态框
 * @param {boolean} options.escClose - 是否支持ESC键关闭
 * @param {string} options.size - 模态框大小
 * @param {string} options.className - 额外的CSS类名
 * @param {Function} options.onOpen - 模态框打开回调
 * @param {Function} options.onClose - 模态框关闭回调
 * @returns {Object} 包含modal元素和控制方法的对象
 */
export function createModal({ 
  title = '', 
  content = '', 
  showCloseButton = true, 
  showFooter = true, 
  buttons = [], 
  backdropClose = true, 
  escClose = true, 
  size = 'md', 
  className = '', 
  onOpen = () => {}, 
  onClose = () => {} 
}) {
  // 创建模态框背景
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden';
  
  // 创建模态框容器
  const modal = document.createElement('div');
  
  // 设置模态框大小
  let modalClasses = 'bg-white rounded-lg shadow-xl overflow-hidden max-w-full max-h-[90vh] flex flex-col';
  
  switch (size) {
    case 'sm':
      modalClasses += ' w-[300px]';
      break;
    case 'md':
      modalClasses += ' w-[500px]';
      break;
    case 'lg':
      modalClasses += ' w-[800px]';
      break;
    case 'xl':
      modalClasses += ' w-[90vw]';
      break;
    default:
      modalClasses += ' w-[500px]';
  }
  
  // 添加自定义类名
  if (className) {
    modalClasses += ' ' + className;
  }
  
  modal.className = modalClasses;
  
  // 创建模态框头部
  const header = document.createElement('div');
  header.className = 'px-6 py-4 border-b border-gray-200 flex justify-between items-center';
  
  // 设置标题
  if (title) {
    const titleElement = document.createElement('h3');
    titleElement.className = 'text-lg font-medium text-gray-900';
    titleElement.textContent = title;
    header.appendChild(titleElement);
  }
  
  // 添加关闭按钮
  if (showCloseButton) {
    const closeButton = document.createElement('button');
    closeButton.className = 'text-gray-400 hover:text-gray-500 focus:outline-none';
    closeButton.innerHTML = '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
    
    closeButton.addEventListener('click', () => {
      close();
    });
    
    header.appendChild(closeButton);
  }
  
  // 创建模态框内容
  const body = document.createElement('div');
  body.className = 'px-6 py-4 overflow-y-auto max-h-[60vh]';
  
  // 设置内容
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  // 创建模态框底部
  const footer = document.createElement('div');
  footer.className = 'px-6 py-4 border-t border-gray-200 flex justify-end space-x-3';
  
  // 添加按钮
  buttons.forEach(button => {
    const buttonElement = document.createElement('button');
    
    // 设置按钮基础样式
    let buttonClasses = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // 根据按钮类型设置样式
    if (button.type === 'primary') {
      buttonClasses += ' bg-primary text-white hover:bg-primary/90 focus:ring-primary/50';
    } else if (button.type === 'danger') {
      buttonClasses += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50';
    } else if (button.type === 'success') {
      buttonClasses += ' bg-green-600 text-white hover:bg-green-700 focus:ring-green-500/50';
    } else {
      buttonClasses += ' bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500/50';
    }
    
    // 添加自定义类名
    if (button.className) {
      buttonClasses += ' ' + button.className;
    }
    
    buttonElement.className = buttonClasses;
    buttonElement.textContent = button.label || '按钮';
    
    // 设置按钮点击事件
    if (button.onClick && typeof button.onClick === 'function') {
      buttonElement.addEventListener('click', () => {
        button.onClick();
      });
    }
    
    // 设置按钮禁用状态
    if (button.disabled) {
      buttonElement.disabled = true;
      buttonElement.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    footer.appendChild(buttonElement);
  });
  
  // 添加到模态框
  modal.appendChild(header);
  modal.appendChild(body);
  
  // 如果有按钮或明确显示底部，则添加底部
  if (showFooter && (buttons.length > 0 || showFooter === true)) {
    modal.appendChild(footer);
  }
  
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  
  // ESC键关闭模态框
  function handleEscClose(e) {
    if (e.key === 'Escape' && escClose) {
      close();
    }
  }
  
  // 点击背景关闭模态框
  function handleBackdropClose(e) {
    if (backdropClose && e.target === backdrop) {
      close();
    }
  }
  
  // 打开模态框
  function open() {
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    document.addEventListener('keydown', handleEscClose);
    backdrop.addEventListener('click', handleBackdropClose);
    onOpen();
  }
  
  // 关闭模态框
  function close() {
    backdrop.classList.add('hidden');
    document.body.style.overflow = 'auto'; // 恢复背景滚动
    document.removeEventListener('keydown', handleEscClose);
    backdrop.removeEventListener('click', handleBackdropClose);
    onClose();
  }
  
  // 更新模态框内容
  function updateContent(newContent) {
    body.innerHTML = '';
    
    if (typeof newContent === 'string') {
      body.innerHTML = newContent;
    } else if (newContent instanceof HTMLElement) {
      body.appendChild(newContent);
    }
  }
  
  // 更新模态框标题
  function updateTitle(newTitle) {
    if (title) {
      const titleElement = header.querySelector('h3');
      if (titleElement) {
        titleElement.textContent = newTitle;
      }
    }
  }
  
  // 销毁模态框
  function destroy() {
    // 确保先关闭模态框
    close();
    
    // 从DOM中移除
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }
  
  // 添加动画类
  function addAnimation(animationType = 'fadeIn') {
    // 这里可以根据需要添加不同的动画类
    switch (animationType) {
      case 'fadeIn':
        modal.classList.add('animate-fadeIn');
        break;
      case 'slideIn':
        modal.classList.add('animate-slideIn');
        break;
      default:
        modal.classList.add('animate-fadeIn');
    }
  }
  
  return {
    modal: backdrop,
    open,
    close,
    updateContent,
    updateTitle,
    destroy,
    addAnimation
  };
}