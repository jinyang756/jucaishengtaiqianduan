// Button组件
/**
 * 基础按钮组件
 * @param {Object} options - 按钮配置选项
 * @param {string} options.text - 按钮文本
 * @param {string} options.type - 按钮类型：primary, secondary, danger, success
 * @param {string} options.size - 按钮尺寸：small, medium, large
 * @param {boolean} options.disabled - 是否禁用
 * @param {Function} options.onClick - 点击事件处理函数
 * @param {string} options.icon - 图标类名（Font Awesome）
 * @param {string} options.className - 额外的CSS类名
 * @returns {HTMLButtonElement} 创建的按钮元素
 */
export function createButton({ 
  text, 
  type = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick = () => {}, 
  icon = '', 
  className = '' 
}) {
  // 创建按钮元素
  const button = document.createElement('button');
  
  // 设置基础类名
  let baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 根据类型设置不同的样式
  const typeClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger/50',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    text: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  };
  
  // 根据尺寸设置不同的样式
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  // 组合所有类名
  button.className = `${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  // 设置按钮文本
  if (text) {
    if (icon) {
      // 如果有图标，添加图标元素
      const iconElement = document.createElement('i');
      iconElement.className = `fa ${icon} mr-2`;
      button.appendChild(iconElement);
    }
    
    // 添加文本节点
    button.appendChild(document.createTextNode(text));
  }
  
  // 设置禁用状态
  button.disabled = disabled;
  
  // 添加点击事件
  if (!disabled && onClick) {
    button.addEventListener('click', onClick);
  }
  
  // 添加辅助方法
  button.setDisabled = function(isDisabled) {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      this.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  };
  
  button.setText = function(newText) {
    // 清空现有内容但保留图标
    while (this.firstChild) {
      if (this.firstChild.tagName === 'I') {
        break;
      }
      this.removeChild(this.firstChild);
    }
    
    // 删除非图标元素
    while (this.lastChild && this.lastChild.tagName !== 'I') {
      this.removeChild(this.lastChild);
    }
    
    // 添加新文本
    if (newText) {
      if (this.firstChild && this.firstChild.tagName === 'I') {
        this.appendChild(document.createTextNode(newText));
      } else {
        this.textContent = newText;
      }
    }
  };
  
  return button;
}