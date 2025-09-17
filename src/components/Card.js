// Card组件
/**
 * 创建卡片组件
 * @param {Object} options - 卡片配置选项
 * @param {HTMLElement|string} options.header - 卡片头部内容
 * @param {HTMLElement|string} options.content - 卡片主体内容
 * @param {HTMLElement|string} options.footer - 卡片底部内容
 * @param {string} options.className - 额外的CSS类名
 * @param {boolean} options.shadow - 是否显示阴影
 * @param {boolean} options.border - 是否显示边框
 * @param {boolean} options.hover - 是否添加悬停效果
 * @returns {HTMLDivElement} 创建的卡片元素
 */
export function createCard({ 
  header = null, 
  content = null, 
  footer = null, 
  className = '', 
  shadow = true, 
  border = false, 
  hover = true 
}) {
  // 创建卡片容器
  const card = document.createElement('div');
  
  // 设置基础类名
  let baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // 添加阴影、边框和悬停效果
  if (shadow) {
    baseClasses += ' shadow-md';
  }
  
  if (border) {
    baseClasses += ' border border-gray-200';
  }
  
  if (hover) {
    baseClasses += ' hover:shadow-lg transition-shadow duration-300';
  }
  
  // 添加用户自定义类名
  card.className = `${baseClasses} ${className}`;
  
  // 创建卡片头部
  if (header) {
    const headerElement = document.createElement('div');
    headerElement.className = 'px-6 py-4 border-b border-gray-100';
    
    if (typeof header === 'string') {
      headerElement.innerHTML = header;
    } else {
      headerElement.appendChild(header);
    }
    
    card.appendChild(headerElement);
  }
  
  // 创建卡片主体
  if (content) {
    const contentElement = document.createElement('div');
    contentElement.className = 'px-6 py-4';
    
    if (typeof content === 'string') {
      contentElement.innerHTML = content;
    } else {
      contentElement.appendChild(content);
    }
    
    card.appendChild(contentElement);
  }
  
  // 创建卡片底部
  if (footer) {
    const footerElement = document.createElement('div');
    footerElement.className = 'px-6 py-4 border-t border-gray-100 bg-gray-50';
    
    if (typeof footer === 'string') {
      footerElement.innerHTML = footer;
    } else {
      footerElement.appendChild(footer);
    }
    
    card.appendChild(footerElement);
  }
  
  // 添加辅助方法
  card.setHeader = function(newHeader) {
    // 移除现有的头部
    if (card.querySelector('.px-6.py-4.border-b')) {
      card.querySelector('.px-6.py-4.border-b').remove();
    }
    
    // 添加新头部
    if (newHeader) {
      const headerElement = document.createElement('div');
      headerElement.className = 'px-6 py-4 border-b border-gray-100';
      
      if (typeof newHeader === 'string') {
        headerElement.innerHTML = newHeader;
      } else {
        headerElement.appendChild(newHeader);
      }
      
      // 如果有内容，插入到内容前面
      if (card.querySelector('.px-6.py-4:not(.border-b):not(.border-t)')) {
        card.insertBefore(headerElement, card.querySelector('.px-6.py-4:not(.border-b):not(.border-t)'));
      } else {
        card.appendChild(headerElement);
      }
    }
  };
  
  card.setContent = function(newContent) {
    // 移除现有的内容
    const contentElements = card.querySelectorAll('.px-6.py-4:not(.border-b):not(.border-t)');
    contentElements.forEach(el => el.remove());
    
    // 添加新内容
    if (newContent) {
      const contentElement = document.createElement('div');
      contentElement.className = 'px-6 py-4';
      
      if (typeof newContent === 'string') {
        contentElement.innerHTML = newContent;
      } else {
        contentElement.appendChild(newContent);
      }
      
      // 如果有底部，插入到底部前面；如果有头部，插入到头部后面；否则添加到最后
      if (card.querySelector('.px-6.py-4.border-t')) {
        card.insertBefore(contentElement, card.querySelector('.px-6.py-4.border-t'));
      } else if (card.querySelector('.px-6.py-4.border-b')) {
        card.appendChild(contentElement);
      } else {
        card.appendChild(contentElement);
      }
    }
  };
  
  card.setFooter = function(newFooter) {
    // 移除现有的底部
    if (card.querySelector('.px-6.py-4.border-t')) {
      card.querySelector('.px-6.py-4.border-t').remove();
    }
    
    // 添加新底部
    if (newFooter) {
      const footerElement = document.createElement('div');
      footerElement.className = 'px-6 py-4 border-t border-gray-100 bg-gray-50';
      
      if (typeof newFooter === 'string') {
        footerElement.innerHTML = newFooter;
      } else {
        footerElement.appendChild(newFooter);
      }
      
      card.appendChild(footerElement);
    }
  };
  
  return card;
}